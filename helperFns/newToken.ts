import jwt from "jsonwebtoken";

export function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // arg1: payload, arg2: secret, arg3: expiration_timer
}
