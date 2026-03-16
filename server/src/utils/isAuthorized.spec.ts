import { Request, Response, NextFunction } from "express";
import { isAuthorized } from "./isAuthorized";
import { getUserFromRequest } from "./getUserFromRequest";

jest.mock("./getUserFromRequest");

const mockedGetUser = getUserFromRequest as jest.MockedFunction<
  typeof getUserFromRequest
>;

function mockRes(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe("isAuthorized middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("appelle next() quand un utilisateur est trouvé", async () => {
    mockedGetUser.mockResolvedValue({ id: 1, email: "a@b.com" } as any);
    const next = jest.fn() as NextFunction;
    const req = {} as Request;
    const res = mockRes();

    await isAuthorized(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retourne 403 quand aucun utilisateur n'est trouvé", async () => {
    mockedGetUser.mockResolvedValue(null);
    const next = jest.fn() as NextFunction;
    const req = {} as Request;
    const res = mockRes();

    await isAuthorized(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "access denied" });
  });
});
