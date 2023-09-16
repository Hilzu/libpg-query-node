import protobuf from "protobufjs";
import { fileURLToPath } from "node:url";

const protoPath = new URL(
  "libpg_query/protobuf/pg_query.proto",
  import.meta.url,
);
const root = await protobuf.load(fileURLToPath(protoPath));

export const ScanResult = root.lookupType("pg_query.ScanResult");
