# libpg-query-wasm

Webassembly bindings for [libpg_query][libpg_query].

## API

### `parse(query: string): Record<string, any>`

Parses a query and returns the parse tree.

[Usage in libpg_query documentation][usage-parse].

```js
import { parse } from "libpg-query-wasm";

const parseTree = parse("SELECT 1");
assert.deepEqual(parseTree, {
  stmts: [
    {
      stmt: {
        SelectStmt: {
          limitOption: "LIMIT_OPTION_DEFAULT",
          op: "SETOP_NONE",
          targetList: [
            {
              ResTarget: {
                location: 7,
                val: { A_Const: { ival: { ival: 1 }, location: 7 } },
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

### `parsePLpgSQL(functionSource: string): Array<Record<string, any>>`

Parse a PL/pgSQL functions from given source and return the parse trees.

[Usage in libpg_query documentation][usage-parse-plpgsql].

```js
import { parsePLpgSQL } from "libpg-query-wasm";

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

### `fingerprint(query: string): string`

Parses a query and returns the fingerprint of the parse tree as a hex string.
Fingerprinting allows you to identify similar queries.

[Usage in libpg_query documentation][usage-fingerprint].

```js
import { fingerprint } from "libpg-query-wasm";

const hex = fingerprint("select 1");
assert.equal(hex, "50fde20626009aba");
```

### `scan(query: string): Record<string, any>`

Scans a query and returns the tokens.

[Usage in libpg_query documentation][usage-scan].

```js
import { scan } from "libpg-query-wasm";

const res = scan("select * from table -- comment");
assert.deepEqual(res.tokens, [
  {
    end: 6,
    keywordKind: "RESERVED_KEYWORD",
    source: "select",
    token: "SELECT",
  },
  { end: 8, source: "*", start: 7, token: "ASCII_42" },
  {
    end: 13,
    keywordKind: "RESERVED_KEYWORD",
    source: "from",
    start: 9,
    token: "FROM",
  },
  {
    end: 19,
    keywordKind: "RESERVED_KEYWORD",
    source: "table",
    start: 14,
    token: "TABLE",
  },
  { end: 30, source: "-- comment", start: 20, token: "SQL_COMMENT" },
]);
```

[libpg_query]: https://github.com/pganalyze/libpg_query
[fingerprinting]: https://github.com/pganalyze/libpg_query/wiki/Fingerprinting
[usage-parse]: https://github.com/pganalyze/libpg_query#usage-parsing-a-query
[usage-scan]:
  https://github.com/pganalyze/libpg_query#usage-scanning-a-query-into-its-tokens-using-the-postgresql-scannerlexer
[usage-fingerprint]:
  https://github.com/pganalyze/libpg_query#usage-fingerprinting-a-query
[usage-parse-plpgsql]:
  https://github.com/pganalyze/libpg_query#usage-parsing-a-plpgsql-function
