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
