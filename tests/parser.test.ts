//@ts-ignore
import { parser, SyntaxError } from "../parser";

test("parse simple", () => {
  const s = "this is the header\n\
    --\n\
    one\n\
    --\n\
    two\n";
  const ast = parser.parse(s);
  console.log(ast);
});
