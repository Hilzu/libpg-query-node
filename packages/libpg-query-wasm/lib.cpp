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

struct ParseResult {
  std::string parse_tree;
  Error error;
};

ParseResult parse(std::string input) {
  auto result = pg_query_parse(input.c_str());
  ParseResult parse_result;
  parse_result.parse_tree = std::string(result.parse_tree);
  if (result.error) {
    parse_result.error = handleError(result.error);
  }
  pg_query_free_parse_result(result);
  return parse_result;
}

PgQueryScanResult scan_result;

Error scan(std::string input) {
  auto result = pg_query_scan(input.c_str());
  scan_result = result;
  Error scan_error;
  if (result.error) {
    scan_error = handleError(result.error);
  }
  return scan_error;
}

val get_protobuf() {
  return val(typed_memory_view(
      scan_result.pbuf.len,
      reinterpret_cast<unsigned char *>(scan_result.pbuf.data)));
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

EMSCRIPTEN_BINDINGS(my_module) {
  value_object<Error>("Error")
      .field("message", &Error::message)
      .field("funcname", &Error::funcname)
      .field("filename", &Error::filename)
      .field("lineno", &Error::lineno)
      .field("cursorpos", &Error::cursorpos)
      .field("context", &Error::context);

  value_object<ParseResult>("ParseResult")
      .field("parse_tree", &ParseResult::parse_tree)
      .field("error", &ParseResult::error);

  function("parse", &parse);

  function("scan", &scan);

  function("get_protobuf", &get_protobuf);

  function("free_scan_result", &free_scan_result);

  value_object<FingerprintResult>("FingerprintResult")
      .field("fingerprint", &FingerprintResult::fingerprint)
      .field("error", &FingerprintResult::error);

  function("fingerprint", &fingerprint);
}
