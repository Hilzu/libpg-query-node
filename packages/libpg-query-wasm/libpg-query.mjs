import factory from "./dist/lib.mjs";
import { ScanResult } from "./protobuf.mjs";

const module = await factory();

export class LibpgQueryError extends Error {
  name = "LibpgQueryError";
  /** source of exception (e.g. parse.l) */
  filename = "";
  /** source function of exception (e.g. SearchSysCache) */
  funcname = "";
  /** additional context (optional) */
  context = "";
  /** char in query at which exception occurred */
  cursorpos = 0;
  /** source of exception (e.g. 104) */
  lineno = 0;
}

function throwError(res) {
  const err = new LibpgQueryError(res.error.message);
  err.filename = res.error.filename;
  err.funcname = res.error.funcname;
  err.context = res.error.context;
  err.cursorpos = res.error.cursorpos;
  err.lineno = res.error.lineno;
  throw err;
}

export const parse = (query) => {
  const res = module.parse(query);
  if (res.error?.message) {
    throwError(res);
  }

  return JSON.parse(res.parse_tree);
};

export const scan = (query) => {
  const res = module.scan(query);
  if (res.error?.message) {
    throwError(res);
  }
  const buf = module.get_protobuf();
  const json = ScanResult.decode(buf).toJSON();
  for (const token of json.tokens) {
    token.source = query.slice(token.start ?? 0, token.end);
  }
  module.free_scan_result();
  return json;
};
