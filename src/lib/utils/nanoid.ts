import { customAlphabet } from "nanoid";

// Alfabeto sin caracteres ambiguos (0/O, 1/l/I) para códigos legibles.
const alphabet =
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const generateShortCode = customAlphabet(alphabet, 7);
