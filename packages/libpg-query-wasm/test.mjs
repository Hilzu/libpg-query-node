import Module from "./dist/hello.mjs";

const module = await Module();
console.log(module);
const parse = module.cwrap("parse");
console.log(parse);
console.log(parse());
