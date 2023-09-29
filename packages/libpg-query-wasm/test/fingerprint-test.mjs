import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { fingerprint } from "libpg-query-wasm";

describe("fingerprint", () => {
  it("fingerprint simple statement", () => {
    const res = fingerprint("select 1");
    assert.equal(res, "50fde20626009aba");
  });

  it("throws on invalid argument", () => {
    assert.throws(() => {
      fingerprint(null);
    });
    assert.throws(() => {
      fingerprint(2);
    });
    assert.throws(() => {
      fingerprint(undefined);
    });
  });
});
