import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (
  DtoClass: any,
  source: "body" | "params" | "query" = "body",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(DtoClass, req[source]);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const messages = errors.flatMap((err) =>
        err.constraints ? Object.values(err.constraints) : [],
      );
      return res.status(400).json({ errors: messages });
    }

    next();
  };
};
