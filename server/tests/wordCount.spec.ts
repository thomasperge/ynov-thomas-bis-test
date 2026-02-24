import request from "supertest";
import app from "./wordCountApp";

describe("POST /count - test d'intégration", () => {
  it("retourne le nombre d'occurrences du mot dans le texte", async () => {
    const response = await request(app)
      .post("/count")
      .send({ text: "le chat mange le poisson et le chat dort", word: "le" });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(3);
  });

  it("retourne 0 si le mot n'est pas présent", async () => {
    const response = await request(app)
      .post("/count")
      .send({ text: "bonjour le monde", word: "xyz" });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
  });

  it("est insensible à la casse", async () => {
    const response = await request(app)
      .post("/count")
      .send({ text: "Hello hello HELLO", word: "hello" });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(3);
  });

  it("retourne 400 si le texte est manquant", async () => {
    const response = await request(app)
      .post("/count")
      .send({ word: "test" });

    expect(response.status).toBe(400);
  });

  it("retourne 400 si le mot est manquant", async () => {
    const response = await request(app)
      .post("/count")
      .send({ text: "hello world" });

    expect(response.status).toBe(400);
  });
});
