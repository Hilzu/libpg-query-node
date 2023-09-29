import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { fingerprint } from "libpg-query-wasm";

describe("fingerprint", () => {
  it("fingerprint simple statement", () => {
    const res = fingerprint("select 1");
    assert.equal(res, "50fde20626009aba");
  });

  it("fingerprint empty query", () => {
    const res = fingerprint("");
    assert.equal(res, "d8d13f8b2da6c9ad");
  });

  it("throws on invalid query", () => {
    assert.throws(
      () => {
        fingerprint("not a valid query");
      },
      {
        name: "LibpgQueryError",
        message: 'syntax error at or near "not"',
      },
    );
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
