// @ts-ignore: There doesn't seem to be a good way to import from dist/ without messing up the output
import factory from "../dist/bindings.mjs";

export interface ModuleError {
  message: string;
  filename: string;
  funcname: string;
  context: string;
  cursorpos: number;
  lineno: number;
}

export interface MainModule {
  get_protobuf(): Uint8Array;
  parse(query: string): ModuleError;
  free_parse_result(): void;
  scan(query: string): ModuleError;
  free_scan_result(): void;
  fingerprint(query: string): { error: ModuleError; fingerprint: string };
  parse_plpgsql(functionSource: string): {
    error: ModuleError;
    plpgsql_funcs: string;
  };
}

const module: MainModule = await factory();

export default module;
