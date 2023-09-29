import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { scan, ScanResult } from "libpg-query-wasm";

describe("scan", () => {
  it("scans simple statement", () => {
    const msg = scan("select 1");
    assert.deepEqual(ScanResult.toObject(msg, { enums: String }), {
      version: 150001,
      tokens: [
        { end: 6, token: "SELECT", keywordKind: "RESERVED_KEYWORD" },
        { start: 7, end: 8, token: "ICONST" },
      ],
    });
  });

  it("returns no tokens with empty query", () => {
    const msg = scan("");
    assert.deepEqual(msg.tokens, []);
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
