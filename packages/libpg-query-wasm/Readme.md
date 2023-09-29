# libpg-query-wasm

[![npm version](https://badge.fury.io/js/libpg-query-wasm.svg)](https://badge.fury.io/js/libpg-query-wasm)

Webassembly bindings and Typescript types for [libpg_query][libpg_query].

```shell
npm install libpg-query-wasm
```

## API

<!-- !test program node --input-type=module -->

### `parse(query: string): ParseResult`

Parses a query and returns the parse tree as a Protocol Buffer
[message](#using-protocol-buffers).

[Usage in libpg_query documentation][usage-parse].

<!-- !test check parse -->

```js
import { parse, ParseResult } from "libpg-query-wasm";
import { strict as assert } from "node:assert";

const message = parse("SELECT 1");
assert.deepEqual(ParseResult.toObject(message, { enums: String }), {
  stmts: [
    {
      stmt: {
        selectStmt: {
          limitOption: "LIMIT_OPTION_DEFAULT",
          op: "SETOP_NONE",
          targetList: [
            {
              resTarget: {
                location: 7,
                val: { aConst: { ival: { ival: 1 }, location: 7 } },
              },
            },
          ],
        },
      },
    },
  ],
  version: 150001,
});
```

### `fingerprint(query: string): string`

Parses a query and returns the fingerprint of the parse tree as a hex string.
Fingerprinting allows you to identify similar queries.

[Usage in libpg_query documentation][usage-fingerprint].

<!-- !test check fingerprint -->

```js
import { fingerprint } from "libpg-query-wasm";
import { strict as assert } from "node:assert";

const hex = fingerprint("select 1");
assert.equal(hex, "50fde20626009aba");
```

### `scan(query: string): ScanResult`

Scans a query and returns the tokens as a Protocol Buffer
[message](#using-protocol-buffers).

[Usage in libpg_query documentation][usage-scan].

<!-- !test check scan -->

```js
import { scan, ScanResult } from "libpg-query-wasm";
import { strict as assert } from "node:assert";

const message = scan("select * from table -- comment");
assert.deepEqual(ScanResult.toObject(message, { enums: String }), {
  version: 150001,
  tokens: [
    { end: 6, token: "SELECT", keywordKind: "RESERVED_KEYWORD" },
    { start: 7, end: 8, token: "ASCII_42" },
    { start: 9, end: 13, token: "FROM", keywordKind: "RESERVED_KEYWORD" },
    { start: 14, end: 19, token: "TABLE", keywordKind: "RESERVED_KEYWORD" },
    { start: 20, end: 30, token: "SQL_COMMENT" },
  ],
});
```

### `parsePLpgSQL(functionSource: string): Array<Record<string, any>>`

Parse a PL/pgSQL functions from given source and return the parse trees.

[Usage in libpg_query documentation][usage-parse-plpgsql].

<!-- !test check parsePLpgSQL -->

```js
import { parsePLpgSQL } from "libpg-query-wasm";
import { strict as assert } from "node:assert";

const functions = parsePLpgSQL(`
CREATE FUNCTION f() RETURNS integer AS $$
BEGIN
    RETURN 1;
END;
$$ LANGUAGE plpgsql;`);
assert.deepEqual(functions, [
  {
    PLpgSQL_function: {
      action: {
        PLpgSQL_stmt_block: {
          body: [
            {
              PLpgSQL_stmt_return: {
                expr: { PLpgSQL_expr: { query: "1" } },
                lineno: 3,
              },
            },
          ],
          lineno: 2,
        },
      },
      datums: [
        {
          PLpgSQL_var: {
            datatype: { PLpgSQL_type: { typname: "UNKNOWN" } },
            refname: "found",
          },
        },
      ],
    },
  },
]);
```

## Using protocol buffers

Some functions return a [Protocol Buffer][protobuf] message instance. Using
these messages gives you access to the original fields with the correct types.
If you'd rather use plain objects you can use the [`toObject`][to-object] static
method to convert the message.

We use the [protobuf.js][protobufjs] library to decode the messages returned by
[libpg_query][libpg_query]. It's also used to generate the Typescript types. You
can find more information about the usage of the messages in the [protobufjs
documentation][protobufjs-usage].

[libpg_query]: https://github.com/pganalyze/libpg_query
[usage-parse]: https://github.com/pganalyze/libpg_query#usage-parsing-a-query
[usage-scan]:
  https://github.com/pganalyze/libpg_query#usage-scanning-a-query-into-its-tokens-using-the-postgresql-scannerlexer
[usage-fingerprint]:
  https://github.com/pganalyze/libpg_query#usage-fingerprinting-a-query
[usage-parse-plpgsql]:
  https://github.com/pganalyze/libpg_query#usage-parsing-a-plpgsql-function
[protobuf]: https://protobuf.dev/
[to-object]:
  https://github.com/protobufjs/protobuf.js#toolset:~:text=to%20a%20string-,Message.toObject,-(message%3A%20Message
[protobufjs]: https://github.com/protobufjs/protobuf.js#readme
[protobufjs-usage]: https://github.com/protobufjs/protobuf.js#usage
