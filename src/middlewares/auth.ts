import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

const jwtValidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log("No header");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const { sub: auth0Id } = jwt.decode(token) as jwt.JwtPayload;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      console.log("No user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = user._id.toString();
    req.auth0Id = auth0Id as string;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { jwtCheck, jwtValidate };
