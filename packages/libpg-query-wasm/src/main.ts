import module, { ModuleError } from "./bindings-wrapper.js";
import { pg_query } from "../dist/pg_query.js";

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

function assertError(error: ModuleError) {
  if (error.lineno === -1) return;
  const err = new LibpgQueryError(String(error.message));
  err.filename = String(error.filename);
  err.funcname = String(error.funcname);
  err.context = String(error.context);
  err.cursorpos = error.cursorpos;
  err.lineno = error.lineno;
  throw err;
}

export const parse = (query: string): any => {
  const res = module.parse(query);
  assertError(res.error);

  return JSON.parse(res.parse_tree);
};

export const ScanResult = pg_query.ScanResult;

export const scan = (query: string): pg_query.ScanResult => {
  const error = module.scan(query);
  try {
    assertError(error);
    const buf = module.get_protobuf();
    return ScanResult.decode(buf);
  } finally {
    module.free_scan_result();
  }
};

export const fingerprint = (query: string): string => {
  const res = module.fingerprint(query);
  assertError(res.error);

  return res.fingerprint;
};

export const parsePLpgSQL = (functionSource: string): any => {
  const res = module.parse_plpgsql(functionSource);
  assertError(res.error);

  return JSON.parse(res.plpgsql_funcs);
};
