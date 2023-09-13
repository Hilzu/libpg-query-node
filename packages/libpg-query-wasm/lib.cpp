#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <pg_query.h>

using namespace emscripten;

struct Error {
  std::string message;
  std::string funcname;
  std::string filename;
  int lineno;
  int cursorpos;
  std::string context;
};

struct ParseResult {
  std::string parse_tree;
  std::string stderr_buffer;
  Error error;
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

ParseResult parse(std::string input) {
  auto result = pg_query_parse(input.c_str());
  ParseResult parse_result;
  parse_result.parse_tree = std::string(result.parse_tree);
  if (result.stderr_buffer) {
    parse_result.stderr_buffer = std::string(result.stderr_buffer);
  }
  if (result.error) {
    parse_result.error = handleError(result.error);
  }
  pg_query_free_parse_result(result);
  return parse_result;
}

struct ScanError {
  std::string stderr_buffer;
  Error error;
};

PgQueryScanResult scan_result;

ScanError scan(std::string input) {
  auto result = pg_query_scan(input.c_str());
  ScanError scan_error;
  if (result.stderr_buffer) {
    scan_error.stderr_buffer = std::string(result.stderr_buffer);
  }
  if (result.error) {
    scan_error.error = handleError(result.error);
  }
  scan_result = result;
  return scan_error;
}

val get_protobuf() {
  return val(typed_memory_view(
      scan_result.pbuf.len,
      reinterpret_cast<unsigned char *>(scan_result.pbuf.data)));
}

void free_scan_result() { pg_query_free_scan_result(scan_result); }

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
      .field("stderr_buffer", &ParseResult::stderr_buffer)
      .field("error", &ParseResult::error);

  value_object<ScanError>("ScanError")
      .field("stderr_buffer", &ScanError::stderr_buffer)
      .field("error", &ScanError::error);

  function("parse", &parse);

  function("scan", &scan);

  function("get_protobuf", &get_protobuf);

  function("free_scan_result", &free_scan_result);
}
