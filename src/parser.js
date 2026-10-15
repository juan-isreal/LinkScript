// src/parser.js
const { TokenType } = require('./lexer');

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        const body = [];
        while (!this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        return { type: 'Program', body };
    }

    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    check(type, value) {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        if (token.type !== type) return false;
        if (value !== undefined && token.value !== value) return false;
        return true;
    }

    match(type, value) {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    consume(type, value, message) {
        if (this.check(type, value)) return this.advance();
        const token = this.peek();
        throw new Error(`[Parser Error] ${message} at line ${token.line}, found '${token.value}'`);
    }

    parseStatement() {
        // const variable declaration
        if (this.match(TokenType.KEYWORD, 'const')) {
            return this.parseVarDecl(true);
        }

        // function definition
        if (this.match(TokenType.KEYWORD, 'def')) {
            return this.parseFunctionDecl();
        }

        // print statement
        if (this.match(TokenType.KEYWORD, 'print')) {
            return this.parsePrintStatement();
        }

        // if statement
        if (this.match(TokenType.KEYWORD, 'if')) {
            return this.parseIfStatement();
        }

        // while loop
        if (this.match(TokenType.KEYWORD, 'while')) {
            return this.parseWhileStatement();
        }

        // typed variable declaration (e.g., int score = 10) or assignment
        return this.parseAssignmentOrExpr();
    }

    parseVarDecl(isConst) {
        let varType = null;
        if (this.peek().type === TokenType.TYPE) {
            varType = this.advance().value;
        }

        const nameToken = this.consume(TokenType.IDENTIFIER, undefined, 'Expect variable name');
        this.consume(TokenType.OPERATOR, '=', "Expect '=' after variable name");
        const initializer = this.parseExpression();

        return {
            type: 'VariableDeclaration',
            isConst,
            varType,
            name: nameToken.value,
            initializer
        };
    }

    parseAssignmentOrExpr() {
        // Check if it's a typed variable declaration without const (e.g., int score = 42)
        if (this.peek().type === TokenType.TYPE) {
            const varType = this.advance().value;
            const nameToken = this.consume(TokenType.IDENTIFIER, undefined, 'Expect variable name');
            this.consume(TokenType.OPERATOR, '=', "Expect '=' after variable name");
            const initializer = this.parseExpression();
            return {
                type: 'VariableDeclaration',
                isConst: false,
                varType,
                name: nameToken.value,
                initializer
            };
        }

        const expr = this.parseExpression();

        // Check if it's an assignment (identifier = expr)
        if (expr.type === 'Identifier' && this.match(TokenType.OPERATOR, '=')) {
            const value = this.parseExpression();
            return {
                type: 'Assignment',
                name: expr.name,
                value
            };
        }

        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    }

    parseFunctionDecl() {
        const nameToken = this.consume(TokenType.IDENTIFIER, undefined, 'Expect function name after def');
        this.consume(TokenType.PUNCTUATION, '(', "Expect '(' after function name");
        
        const params = [];
        if (!this.check(TokenType.PUNCTUATION, ')')) {
            do {
                params.push(this.consume(TokenType.IDENTIFIER, undefined, 'Expect parameter name').value);
            } while (this.match(TokenType.OPERATOR, ','));
        }
        this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after parameters");
        
        this.consume(TokenType.PUNCTUATION, '{', "Expect '{' before function body");
        const body = [];
        while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        this.consume(TokenType.PUNCTUATION, '}', "Expect '}' after function body");

        return {
            type: 'FunctionDeclaration',
            name: nameToken.value,
            params,
            body
        };
    }

    parsePrintStatement() {
        this.consume(TokenType.PUNCTUATION, '(', "Expect '(' after print");
        const arg = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after print argument");
        return {
            type: 'PrintStatement',
            argument: arg
        };
    }

    parseIfStatement() {
        this.consume(TokenType.PUNCTUATION, '(', "Expect '(' after if");
        const condition = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after if condition");

        this.consume(TokenType.PUNCTUATION, '{', "Expect '{' for if block");
        const consequent = [];
        while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
            consequent.push(this.parseStatement());
        }
        this.consume(TokenType.PUNCTUATION, '}', "Expect '}' after if block");

        let alternate = null;
        if (this.match(TokenType.KEYWORD, 'else')) {
            this.consume(TokenType.PUNCTUATION, '{', "Expect '{' for else block");
            alternate = [];
            while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
                alternate.push(this.parseStatement());
            }
            this.consume(TokenType.PUNCTUATION, '}', "Expect '}' after else block");
        }

        return {
            type: 'IfStatement',
            condition,
            consequent,
            alternate
        };
    }

    parseWhileStatement() {
        this.consume(TokenType.PUNCTUATION, '(', "Expect '(' after while");
        const condition = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after while condition");

        this.consume(TokenType.PUNCTUATION, '{', "Expect '{' for while loop body");
        const body = [];
        while (!this.check(TokenType.PUNCTUATION, '}') && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        this.consume(TokenType.PUNCTUATION, '}', "Expect '}' after while loop body");

        return {
            type: 'WhileStatement',
            condition,
            body
        };
    }

    parseExpression() {
        return this.parseEquality();
    }

    parseEquality() {
        let expr = this.parseComparison();
        while (this.check(TokenType.OPERATOR, '==') || this.check(TokenType.OPERATOR, '!=')) {
            const operator = this.advance().value;
            const right = this.parseComparison();
            expr = { type: 'BinaryExpression', left: expr, operator, right };
        }
        return expr;
    }

    parseComparison() {
        let expr = this.parseTerm();
        while (['>', '<', '>=', '<='].includes(this.peek().value)) {
            const operator = this.advance().value;
            const right = this.parseTerm();
            expr = { type: 'BinaryExpression', left: expr, operator, right };
        }
        return expr;
    }

    parseTerm() {
        let expr = this.parseFactor();
        while (this.check(TokenType.OPERATOR, '+') || this.check(TokenType.OPERATOR, '-')) {
            const operator = this.advance().value;
            const right = this.parseFactor();
            expr = { type: 'BinaryExpression', left: expr, operator, right };
        }
        return expr;
    }

    parseFactor() {
        let expr = this.parsePrimary();
        while (this.check(TokenType.OPERATOR, '*') || this.check(TokenType.OPERATOR, '/')) {
            const operator = this.advance().value;
            const right = this.parsePrimary();
            expr = { type: 'BinaryExpression', left: expr, operator, right };
        }
        return expr;
    }

    parsePrimary() {
        const token = this.peek();

        if (token.type === TokenType.NUMBER) {
            this.advance();
            return { type: 'Literal', value: Number(token.value), valueType: token.value.includes('.') ? 'float' : 'int' };
        }

        if (token.type === TokenType.STRING) {
            this.advance();
            return { type: 'Literal', value: token.value, valueType: 'string' };
        }

        if (token.type === TokenType.FSTRING) {
            this.advance();
            return { type: 'FStringLiteral', value: token.value, valueType: 'string' };
        }

        if (token.type === TokenType.IDENTIFIER) {
            this.advance();
            // Check for function call
            if (this.match(TokenType.PUNCTUATION, '(')) {
                const args = [];
                if (!this.check(TokenType.PUNCTUATION, ')')) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.match(TokenType.OPERATOR, ','));
                }
                this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after arguments");
                return { type: 'CallExpression', callee: token.value, arguments: args };
            }
            return { type: 'Identifier', name: token.value };
        }

        if (token.type === TokenType.PUNCTUATION && token.value === '(') {
            this.advance();
            const expr = this.parseExpression();
            this.consume(TokenType.PUNCTUATION, ')', "Expect ')' after expression");
            return expr;
        }

        throw new Error(`[Parser Error] Unexpected token '${token.value}' at line ${token.line}`);
    }
}

module.exports = { Parser };
