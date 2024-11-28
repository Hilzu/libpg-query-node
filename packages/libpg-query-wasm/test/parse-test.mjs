import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { parse, pgQuery } from "libpg-query-wasm";
import { omitUndefinedProps } from "./utils.mjs";

describe("parse", () => {
  it("parses simple statement", () => {
    const result = omitUndefinedProps(parse("SELECT 1"));
    assert.deepEqual(result, {
      stmts: [
        {
          stmt: {
            selectStmt: {
              all: false,
              distinctClause: [],
              fromClause: [],
              groupClause: [],
              groupDistinct: false,
              lockingClause: [],
              sortClause: [],
              limitOption: pgQuery.LimitOption.LIMIT_OPTION_DEFAULT,
              op: pgQuery.SetOperation.SETOP_NONE,
              targetList: [
                {
                  resTarget: {
                    indirection: [],
                    location: 7,
                    name: "",
                    val: {
                      aConst: { isnull: false, ival: { ival: 1 }, location: 7 },
                    },
                  },
                },
              ],
              valuesLists: [],
              windowClause: [],
            },
          },
          stmtLen: 0,
          stmtLocation: 0,
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
