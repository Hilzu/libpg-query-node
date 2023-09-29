import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { parsePLpgSQL } from "libpg-query-wasm";

describe("parse-plpgsql", () => {
  it("parses function", () => {
    const res = parsePLpgSQL(`
CREATE OR REPLACE FUNCTION cs_fmt_browser_version(v_name varchar,
                                                  v_version varchar)
RETURNS varchar AS $$
BEGIN
    IF v_version IS NULL THEN
        RETURN v_name;
    END IF;
    RETURN v_name || '/' || v_version;
END;
$$ LANGUAGE plpgsql;`);
    assert.deepEqual(res, [
      {
        PLpgSQL_function: {
          datums: [
            {
              PLpgSQL_var: {
                refname: "v_name",
                datatype: { PLpgSQL_type: { typname: "UNKNOWN" } },
              },
            },
            {
              PLpgSQL_var: {
                refname: "v_version",
                datatype: { PLpgSQL_type: { typname: "UNKNOWN" } },
              },
            },
            {
              PLpgSQL_var: {
                refname: "found",
                datatype: { PLpgSQL_type: { typname: "UNKNOWN" } },
              },
            },
          ],
          action: {
            PLpgSQL_stmt_block: {
              lineno: 2,
              body: [
                {
                  PLpgSQL_stmt_if: {
                    lineno: 3,
                    cond: { PLpgSQL_expr: { query: "v_version IS NULL" } },
                    then_body: [
                      {
                        PLpgSQL_stmt_return: {
                          lineno: 4,
                          expr: { PLpgSQL_expr: { query: "v_name" } },
                        },
                      },
                    ],
                  },
                },
                {
                  PLpgSQL_stmt_return: {
                    lineno: 6,
                    expr: {
                      PLpgSQL_expr: { query: "v_name || '/' || v_version" },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ]);
  });

  it("returns empty array with empty string", () => {
    const res = parsePLpgSQL("");
    assert.deepEqual(res, []);
  });

  it("throws on invalid function source", () => {
    assert.throws(
      () => {
        parsePLpgSQL("not even close to valid");
      },
      {
        name: "LibpgQueryError",
        message: 'syntax error at or near "not"',
      },
    );
  });

  it("throws on invalid argument", () => {
    assert.throws(() => {
      parsePLpgSQL(null);
    });
    assert.throws(() => {
      parsePLpgSQL(2);
    });
    assert.throws(() => {
      parsePLpgSQL(undefined);
    });
  });
});
