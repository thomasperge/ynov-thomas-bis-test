import jwt from "jsonwebtoken";
import { Request } from "express";
import { getUserFromRequest } from "./getUserFromRequest";
import { User } from "../entities/User";

jest.mock("../entities/User");

const SECRET = "superlongstring";

function fakeReq(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    cookies: {},
    ...overrides,
  } as unknown as Request;
}

describe("getUserFromRequest", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne null sans header Authorization ni cookie", async () => {
    const result = await getUserFromRequest(fakeReq());
    expect(result).toBeNull();
  });

  it("extrait le token depuis le header Bearer", async () => {
    const token = jwt.sign({ userId: 42 }, SECRET);
    const fakeUser = { id: 42, email: "x@y.com" };
    (User.findOneBy as jest.Mock).mockResolvedValue(fakeUser);

    const req = fakeReq({
      headers: { authorization: `Bearer ${token}` } as any,
    });

    const result = await getUserFromRequest(req);
    expect(result).toEqual(fakeUser);
    expect(User.findOneBy).toHaveBeenCalledWith({ id: 42 });
  });

  it("extrait le token depuis les cookies", async () => {
    const token = jwt.sign({ userId: 7 }, SECRET);
    const fakeUser = { id: 7, email: "c@d.com" };
    (User.findOneBy as jest.Mock).mockResolvedValue(fakeUser);

    const req = fakeReq({ cookies: { token } } as any);

    const result = await getUserFromRequest(req);
    expect(result).toEqual(fakeUser);
  });

  it("retourne null si le token est invalide", async () => {
    const req = fakeReq({
      headers: { authorization: "Bearer invalid-token" } as any,
    });

    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });

  it("retourne null si l'utilisateur n'existe pas en base", async () => {
    const token = jwt.sign({ userId: 999 }, SECRET);
    (User.findOneBy as jest.Mock).mockResolvedValue(null);

    const req = fakeReq({
      headers: { authorization: `Bearer ${token}` } as any,
    });

    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });

  it("retourne null si le payload n'a pas de userId", async () => {
    const token = jwt.sign({ foo: "bar" }, SECRET);

    const req = fakeReq({
      headers: { authorization: `Bearer ${token}` } as any,
    });

    const result = await getUserFromRequest(req);
    expect(result).toBeNull();
  });
});
