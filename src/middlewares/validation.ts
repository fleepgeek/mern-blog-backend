import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  next();
};

export const validateMyUserRequest = [
  // Order is important. trim is necessary, else you could submit empty string
  body("name")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Name field is required"),
  body("bio").trim().isString().notEmpty().withMessage("Bio field is required"),
  handleValidationErrors,
];
