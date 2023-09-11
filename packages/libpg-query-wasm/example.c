#include <pg_query.h>
#include <stdio.h>

int main() {
  PgQueryParseResult result;

  result = pg_query_parse("SELECT 1");

  printf("%s\n", result.parse_tree);

  pg_query_free_parse_result(result);
}
