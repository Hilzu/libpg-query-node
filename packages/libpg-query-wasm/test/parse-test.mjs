import { test } from "node:test";
import { strict as assert } from "node:assert";
import { parse } from "../libpg-query.mjs";

test("parse simple statement", () => {
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

test("errors on invalid statement", () => {
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
