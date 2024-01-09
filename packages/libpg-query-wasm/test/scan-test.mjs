import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { scan, pgQuery } from "libpg-query-wasm";

describe("scan", () => {
  it("scans simple statement", () => {
    const result = scan("select 1");
    assert.deepEqual(result, {
      version: 150001,
      tokens: [
        {
          start: 0,
          end: 6,
          token: pgQuery.Token.SELECT,
          keywordKind: pgQuery.KeywordKind.RESERVED_KEYWORD,
        },
        {
          start: 7,
          end: 8,
          token: pgQuery.Token.ICONST,
          keywordKind: pgQuery.KeywordKind.NO_KEYWORD,
        },
      ],
    });
  });

  it("returns no tokens with empty query", () => {
    const result = scan("");
    assert.deepEqual(result.tokens, []);
  });

  it("throws on invalid argument", () => {
    assert.throws(() => {
      scan(null);
    });
    assert.throws(() => {
      scan(2);
    });
    assert.throws(() => {
      scan(undefined);
    });
  });
});
