import factory from "./dist/lib.mjs";

const module = await factory();

export const parse = module.parse;
