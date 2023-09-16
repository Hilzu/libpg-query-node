import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { fingerprint } from "../libpg-query.mjs";

describe("fingerprint", () => {
  it("fingerprint simple statement", () => {
    const res = fingerprint("select 1");
    assert.equal(res, "50fde20626009aba");
  });
});
