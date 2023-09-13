import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { scan } from "../libpg-query.mjs";

describe("scan", () => {
  it("scans simple statement", () => {
    const res = scan("SELECT 1");
    assert.deepEqual(res.tokens, [
      { end: 6, token: "SELECT", keywordKind: "RESERVED_KEYWORD" },
      { start: 7, end: 8, token: "ICONST" },
    ]);
  });
});
