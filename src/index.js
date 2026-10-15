// src/index.js
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { TypeChecker } = require('./typechecker');
const { Transpiler } = require('./transpiler');
const vm = require('vm');

function runLinkScript(sourceCode) {
    // 1. Lexical Analysis (Tokenize)
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.tokenize();

    // 2. Parsing (Build AST)
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // 3. Type Checking & Validation
    const typeChecker = new TypeChecker();
    typeChecker.check(ast);

    // 4. Transpilation (AST -> JavaScript)
    const transpiler = new Transpiler();
    const jsCode = transpiler.transpiler(ast);

    // 5. Execution (Run in Node.js VM sandbox)
    const sandbox = {
        console: console
    };
    vm.createContext(sandbox);
    vm.runInContext(jsCode, sandbox);
}

module.exports = { runLinkScript };
