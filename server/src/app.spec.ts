import request from "supertest";
import app from "./app";
import datasource from "./datasource";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { getCoordinatesFromSearch } from "./utils/getCoordinatesFromSearch";

jest.mock("./utils/getCoordinatesFromSearch");

// Dictionnaire pour stocker les données entre les tests (scénario testing)
const ctx: Record<string, any> = {};

beforeAll(async () => {
  const dbPath = path.join(__dirname, "..", "data", "db.sqlite");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.destroy();
});

// --- Exercice 2 : création de compte ---

describe("POST /api/users", () => {
  it("crée un compte utilisateur avec des données aléatoires (faker)", async () => {
    ctx.email = faker.internet.email();
    ctx.password = faker.internet.password({ length: 12 });

    const response = await request(app)
      .post("/api/users")
      .send({ email: ctx.email, password: ctx.password });

    expect(response.status).toBe(200);
    expect(response.body.item).toBeDefined();
    expect(response.body.item.email).toBe(ctx.email);
    expect(response.body.item.id).toBeDefined();

    ctx.userId = response.body.item.id;
  });

  it("retourne 400 si email ou password manquant", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "only@email.com" });

    expect(response.status).toBe(400);
  });

  it("retourne 400 pour credentials vides", async () => {
    const res = await request(app).post("/api/users").send({});
    expect(res.status).toBe(400);
  });
});

// --- TDD Bug fix : email déjà pris et email invalide ---

describe("POST /api/users - validation email (TDD bug fix)", () => {
  it("retourne 409 si l'email est déjà utilisé par un autre compte", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: ctx.email, password: "anotherpassword123" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already/i);
  });

  it("retourne 400 si l'email n'est pas un format valide (sans @)", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "notanemail", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it("retourne 400 si l'email n'a pas de domaine valide", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "user@", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it("retourne 400 si l'email n'a pas de partie locale", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "@domain.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it("accepte un email valide unique", async () => {
    const uniqueEmail = faker.internet.email();
    const res = await request(app)
      .post("/api/users")
      .send({ email: uniqueEmail, password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.item.email).toBe(uniqueEmail);
  });
});

// --- Exercice 3 : scénario testing ---

describe("Scénario utilisateur complet", () => {
  it("connecte l'utilisateur créé (POST /api/users/tokens)", async () => {
    const response = await request(app)
      .post("/api/users/tokens")
      .send({ email: ctx.email, password: ctx.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    ctx.token = response.body.token;
  });

  it("récupère le profil de l'utilisateur connecté (GET /api/users/me)", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${ctx.token}`);

    expect(response.status).toBe(200);
    expect(response.body.item).toBeDefined();
    expect(response.body.item.email).toBe(ctx.email);
    expect(response.body.item.id).toBe(ctx.userId);
  });

  it("retourne 403 sans token d'authentification", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(403);
  });

  it("retourne 403 avec un token invalide", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(403);
  });

  it("retourne 400 sur POST /api/users/tokens avec mauvais identifiants", async () => {
    const response = await request(app)
      .post("/api/users/tokens")
      .send({ email: "wrong@test.com", password: "wrong" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("retourne 400 sur POST /api/users/tokens avec bon email mais mauvais mot de passe", async () => {
    const response = await request(app)
      .post("/api/users/tokens")
      .send({ email: ctx.email, password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("GET /api/addresses retourne la liste (vide) pour l'utilisateur connecté", async () => {
    const response = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${ctx.token}`);

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
  });
});

// --- POST /api/addresses et POST /api/addresses/searches ---

describe("POST /api/addresses", () => {
  beforeEach(() => {
    (getCoordinatesFromSearch as jest.Mock).mockReset();
  });

  it("retourne 403 sans token", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .send({ searchWord: "Paris", name: "Chez moi" });
    expect(res.status).toBe(403);
  });

  it("retourne 400 si name ou searchWord manquant", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({ searchWord: "Paris" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name and search word/i);

    const res2 = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({ name: "Home" });
    expect(res2.status).toBe(400);
  });

  it("crée une adresse quand la géocodage renvoie des coordonnées", async () => {
    (getCoordinatesFromSearch as jest.Mock).mockResolvedValue({
      lng: 2.35,
      lat: 48.85,
    });

    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({
        searchWord: "Paris",
        name: "Chez moi",
        description: "Ma maison",
      });

    expect(res.status).toBe(200);
    expect(res.body.item).toBeDefined();
    expect(res.body.item.name).toBe("Chez moi");
    expect(res.body.item.lng).toBe(2.35);
    expect(res.body.item.lat).toBe(48.85);
  });

  it("retourne 404 quand le search word ne donne pas de coordonnées", async () => {
    (getCoordinatesFromSearch as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({ searchWord: "xyznonexistent123", name: "Nulle part" });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/search word not found/i);
  });
});

describe("POST /api/addresses/searches", () => {
  it("retourne 403 sans token", async () => {
    const res = await request(app)
      .post("/api/addresses/searches")
      .send({ radius: 1000, from: { lat: 48.85, lng: 2.35 } });
    expect(res.status).toBe(403);
  });

  it("retourne 400 si radius manquant ou invalide", async () => {
    const token = ctx.token as string;
    let res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${token}`)
      .send({ from: { lat: 48.85, lng: 2.35 } });
    expect(res.status).toBe(400);

    res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${token}`)
      .send({ radius: -1, from: { lat: 48.85, lng: 2.35 } });
    expect(res.status).toBe(400);

    res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${token}`)
      .send({ radius: "1000", from: { lat: 48.85, lng: 2.35 } });
    expect(res.status).toBe(400);
  });

  it("retourne 400 si from invalide", async () => {
    const res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({ radius: 1000, from: { lat: 48.85 } });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/from.*lat.*lng/i);
  });

  it("retourne 200 et une liste (éventuellement vide) avec body valide", async () => {
    const res = await request(app)
      .post("/api/addresses/searches")
      .set("Authorization", `Bearer ${ctx.token}`)
      .send({ radius: 50000, from: { lat: 48.85, lng: 2.35 } });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});

// --- Exercice TDD : suppression de compte (DELETE /api/users/me) ---

describe("DELETE /api/users/me (TDD - tests écrits avant l'implémentation)", () => {
  let deleteEmail: string;
  let deletePassword: string;
  let deleteToken: string;

  beforeAll(async () => {
    deleteEmail = faker.internet.email();
    deletePassword = faker.internet.password({ length: 12 });

    await request(app)
      .post("/api/users")
      .send({ email: deleteEmail, password: deletePassword });

    const loginRes = await request(app)
      .post("/api/users/tokens")
      .send({ email: deleteEmail, password: deletePassword });

    deleteToken = loginRes.body.token;
  });

  it("retourne 403 sans token d'authentification", async () => {
    const res = await request(app).delete("/api/users/me");
    expect(res.status).toBe(403);
  });

  it("supprime le compte de l'utilisateur connecté et retourne 200", async () => {
    const res = await request(app)
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${deleteToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("l'utilisateur supprimé ne peut plus se connecter", async () => {
    const res = await request(app)
      .post("/api/users/tokens")
      .send({ email: deleteEmail, password: deletePassword });

    expect(res.status).toBe(400);
  });

  it("l'utilisateur supprimé ne peut plus accéder à son profil", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${deleteToken}`);

    expect(res.status).toBe(403);
  });
});

// --- Route non gérée → 404 ---

describe("404", () => {
  it("retourne 404 pour une route API inexistante", async () => {
    const response = await request(app).get("/api/inexistant");
    expect(response.status).toBe(404);
  });

  it("retourne 404 pour une route hors API", async () => {
    const response = await request(app).get("/foo");
    expect(response.status).toBe(404);
  });
});
