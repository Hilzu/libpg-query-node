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
  parse(query: string): { error: ModuleError; parse_tree: string };
  scan(query: string): ModuleError;
  get_protobuf(): Uint8Array;
  free_scan_result(): void;
  fingerprint(query: string): { error: ModuleError; fingerprint: string };
  parse_plpgsql(functionSource: string): {
    error: ModuleError;
    plpgsql_funcs: string;
  };
}

const module: MainModule = await factory();

export default module;
