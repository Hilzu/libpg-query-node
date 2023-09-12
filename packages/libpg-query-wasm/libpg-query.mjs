import factory from "./dist/lib.mjs";

const module = await factory();

export class LibpgQueryError extends Error {
  name = "LibpgQueryError";
  filename = "";
  funcname = "";
  context = "";
  cursorpos = 0;
  lineno = 0;
}

export const parse = (query) => {
  const res = module.parse(query);
  if (res.error?.message) {
    const err = new LibpgQueryError(res.error.message);
    err.filename = res.error.filename;
    err.funcname = res.error.funcname;
    err.context = res.error.context;
    err.cursorpos = res.error.cursorpos;
    err.lineno = res.error.lineno;
    throw err;
  }

  return JSON.parse(res.parse_tree);
};
