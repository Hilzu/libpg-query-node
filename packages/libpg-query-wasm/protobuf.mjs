import protobuf from "protobufjs";

const root = await protobuf.load("./libpg_query/protobuf/pg_query.proto");

export const ScanResult = root.lookupType("pg_query.ScanResult");
