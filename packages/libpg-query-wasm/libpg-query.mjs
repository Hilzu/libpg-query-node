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

function assertError(error) {
  if (error.lineno === -1) return;
  const err = new LibpgQueryError(error.message);
  err.filename = error.filename;
  err.funcname = error.funcname;
  err.context = error.context;
  err.cursorpos = error.cursorpos;
  err.lineno = error.lineno;
  throw err;
}

export const parse = (query) => {
  const res = module.parse(query);
  assertError(res.error);

  return JSON.parse(res.parse_tree);
};

export const scan = (query) => {
  const error = module.scan(query);
  assertError(error);

  const buf = module.get_protobuf();
  const json = ScanResult.decode(buf).toJSON();
  for (const token of json.tokens) {
    token.source = query.slice(token.start ?? 0, token.end);
  }
  module.free_scan_result();
  return json;
};

export const fingerprint = (query) => {
  const res = module.fingerprint(query);
  assertError(res.error);

  return res.fingerprint;
};

export const parsePLpgSQL = (functionSource) => {
  const res = module.parse_plpgsql(functionSource);
  assertError(res.error);

  return JSON.parse(res.plpgsql_funcs);
};
