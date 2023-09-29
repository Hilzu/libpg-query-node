#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <pg_query.h>

using namespace emscripten;

struct Error {
  std::string message;
  std::string funcname;
  std::string filename;
  int lineno = -1;
  int cursorpos = -1;
  std::string context;
};

Error handleError(PgQueryError *error) {
  Error err;
  err.message = std::string(error->message);
  err.funcname = std::string(error->funcname);
  err.filename = std::string(error->filename);
  err.lineno = error->lineno;
  err.cursorpos = error->cursorpos;
  if (error->context) {
    err.context = std::string(error->context);
  }

  return err;
}

PgQueryProtobuf protobuf;

val get_protobuf() {
  return val(typed_memory_view(
      protobuf.len, reinterpret_cast<unsigned char *>(protobuf.data)));
}

PgQueryProtobufParseResult parse_result;

Error parse(std::string input) {
  auto result = pg_query_parse_protobuf(input.c_str());
  parse_result = result;
  protobuf = result.parse_tree;
  Error parse_error;
  if (result.error) {
    parse_error = handleError(result.error);
  }
  return parse_error;
}

void free_parse_result() { pg_query_free_protobuf_parse_result(parse_result); }

PgQueryScanResult scan_result;

Error scan(std::string input) {
  auto result = pg_query_scan(input.c_str());
  scan_result = result;
  protobuf = result.pbuf;
  Error scan_error;
  if (result.error) {
    scan_error = handleError(result.error);
  }
  return scan_error;
}

void free_scan_result() { pg_query_free_scan_result(scan_result); }

struct FingerprintResult {
  std::string fingerprint;
  Error error;
};

FingerprintResult fingerprint(std::string input) {
  auto result = pg_query_fingerprint(input.c_str());
  FingerprintResult fingerprint_result;
  fingerprint_result.fingerprint = std::string(result.fingerprint_str);
  if (result.error) {
    fingerprint_result.error = handleError(result.error);
  }
  pg_query_free_fingerprint_result(result);
  return fingerprint_result;
}

struct ParsePlpgsqlResult {
  std::string plpgsql_funcs;
  Error error;
};

ParsePlpgsqlResult parse_plpgsql(std::string input) {
  auto result = pg_query_parse_plpgsql(input.c_str());
  ParsePlpgsqlResult parse_plpgsql_result;
  parse_plpgsql_result.plpgsql_funcs = std::string(result.plpgsql_funcs);
  if (result.error) {
    parse_plpgsql_result.error = handleError(result.error);
  }
  pg_query_free_plpgsql_parse_result(result);
  return parse_plpgsql_result;
}

EMSCRIPTEN_BINDINGS(my_module) {
  value_object<Error>("Error")
      .field("message", &Error::message)
      .field("funcname", &Error::funcname)
      .field("filename", &Error::filename)
      .field("lineno", &Error::lineno)
      .field("cursorpos", &Error::cursorpos)
      .field("context", &Error::context);

  function("get_protobuf", &get_protobuf);

  function("parse", &parse);

  function("free_parse_result", &free_parse_result);

  function("scan", &scan);

  function("free_scan_result", &free_scan_result);

  value_object<FingerprintResult>("FingerprintResult")
      .field("fingerprint", &FingerprintResult::fingerprint)
      .field("error", &FingerprintResult::error);

  function("fingerprint", &fingerprint);

  value_object<ParsePlpgsqlResult>("ParsePlpgsqlResult")
      .field("plpgsql_funcs", &ParsePlpgsqlResult::plpgsql_funcs)
      .field("error", &ParsePlpgsqlResult::error);

  function("parse_plpgsql", &parse_plpgsql);
}
