import { parse, SyntaxError } from "../dist/parser";

test("Header only", async () => {
  const s = `this is the header\n
--\n`;

  const EXPECTED_AST = {
    type: "body",
    title: { type: "line", value: "this is the header" },
    summary: { type: "p", value: [] },
    entries: [{ type: "entry", name: null }]
  };

  const ast = parse(s);
  expect(ast).toEqual(EXPECTED_AST);
});

test("Header and description", async () => {
  const s = `this is the header\n
description\n
--\n`;

  const EXPECTED_AST = {
    type: "body",
    title: { type: "line", value: "this is the header" },
    summary: { type: "p", value: ["description"] },
    entries: [{ type: "entry", name: null }]
  };

  const ast = parse(s);
  expect(ast).toEqual(EXPECTED_AST);
});

test("Header and multi-line description", async () => {
  const s = `this is the header\n
description1\n
\n
description dos\n
--\n`;

  const EXPECTED_AST = {
    type: "body",
    title: { type: "line", value: "this is the header" },
    summary: { type: "p", value: ["description1", "description dos"] },
    entries: [{ type: "entry", name: null }]
  };

  const ast = parse(s);
  expect(ast).toEqual(EXPECTED_AST);
});
