// @ts-ignore: Generated types don't include the default export
import factory, { MainModule, Error as LibError } from "../dist/lib.mjs";
import { ScanResult } from "./protobuf.js";

const module: MainModule = await factory();

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

function assertError(error: LibError) {
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

  return JSON.parse(String(res.parse_tree));
};

export const scan = (query: string): Record<string, any> => {
  const error = module.scan(query);
  assertError(error);

  const buf: Uint8Array = module.get_protobuf();
  const json = ScanResult.decode(buf).toJSON();
  for (const token of json.tokens) {
    token.source = query.slice(token.start ?? 0, token.end);
  }
  module.free_scan_result();
  return json;
};

export const fingerprint = (query: string): string => {
  const res = module.fingerprint(query);
  assertError(res.error);

  return String(res.fingerprint);
};

export const parsePLpgSQL = (functionSource: string): any => {
  const res = module.parse_plpgsql(functionSource);
  assertError(res.error);

  return JSON.parse(String(res.plpgsql_funcs));
};
