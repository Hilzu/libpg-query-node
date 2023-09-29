import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { parse } from "libpg-query-wasm";

describe("parse", () => {
  it("parses simple statement", () => {
    const res = parse("SELECT 1");
    assert.deepEqual(res, {
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
  });

  it("errors on invalid statement", () => {
    assert.throws(
      () => {
        parse("SELECTT");
      },
      {
        name: "LibpgQueryError",
        message: 'syntax error at or near "SELECTT"',
      },
    );
  });

  it("throws on invalid argument", () => {
    assert.throws(() => {
      parse(null);
    });
    assert.throws(() => {
      parse(2);
    });
    assert.throws(() => {
      parse(undefined);
    });
  });
});
