import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { scan } from "../dist/libpg-query.js";

describe("scan", () => {
  it("scans simple statement", () => {
    const res = scan("select 1");
    assert.deepEqual(res.tokens, [
      {
        end: 6,
        token: "SELECT",
        keywordKind: "RESERVED_KEYWORD",
        source: "select",
      },
      { start: 7, end: 8, token: "ICONST", source: "1" },
    ]);
  });

  it("scans statement with comment", () => {
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
  });
});
