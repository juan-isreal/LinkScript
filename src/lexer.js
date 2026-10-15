// src/lexer.js

const TokenType = {
    KEYWORD: 'KEYWORD',
    TYPE: 'TYPE',
    IDENTIFIER: 'IDENTIFIER',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    FSTRING: 'FSTRING',
    OPERATOR: 'OPERATOR',
    PUNCTUATION: 'PUNCTUATION',
    EOF: 'EOF'
};

const KEYWORDS = new Set(['def', 'print', 'if', 'elif', 'else', 'while', 'return', 'const']);
const TYPES = new Set(['int', 'float', 'long', 'string', 'bool']);

class Lexer {
    constructor(input) {
        this.input = input;
        this.cursor = 0;
        this.line = 1;
    }

    tokenize() {
        const tokens = [];

        while (this.cursor < this.input.length) {
            const char = this.input[this.cursor];

            // Newlines & line tracking
            if (char === '\n') {
                this.line++;
                this.cursor++;
                continue;
            }

            // Skip whitespace
            if (/\s/.test(char)) {
                this.cursor++;
                continue;
            }

            // Skip single-line comments (#)
            if (char === '#') {
                while (this.cursor < this.input.length && this.input[this.cursor] !== '\n') {
                    this.cursor++;
                }
                continue;
            }

            // Handles f"" or f'' strings
            if ((char === 'f' || char === 'F') && (this.peek(1) === '"' || this.peek(1) === "'")) {
                tokens.push(this.readFString());
                continue;
            }

            // Regular Strings ("..." or '...')
            if (char === '"' || char === "'") {
                tokens.push(this.readString(char));
                continue;
            }

            // Numbers (int/float)
            if (/\d/.test(char)) {
                tokens.push(this.readNumber());
                continue;
            }

            // Identifiers, Keywords, and Types
            if (/[a-zA-Z_]/.test(char)) {
                tokens.push(this.readIdentifier());
                continue;
            }

            // Operators & Punctuation
            if (['=', '+', '-', '*', '/', '>', '<', '!', ':', ','].includes(char)) {
                let op = char;
                if (['=', '!', '>', '<'].includes(char) && this.peek(1) === '=') {
                    op += '=';
                    this.cursor++;
                }
                tokens.push({ type: TokenType.OPERATOR, value: op, line: this.line });
                this.cursor++;
                continue;
            }

            // Structural punctuation () {}
            if (['(', ')', '{', '}'].includes(char)) {
                tokens.push({ type: TokenType.PUNCTUATION, value: char, line: this.line });
                this.cursor++;
                continue;
            }

            throw new Error(`Unexpected character '${char}' at line ${this.line}`);
        }

        tokens.push({ type: TokenType.EOF, value: null, line: this.line });
        return tokens;
    }

    peek(offset = 0) {
        return this.input[this.cursor + offset];
    }

    readString(quote) {
        this.cursor++; // Skip open quote
        let start = this.cursor;
        while (this.cursor < this.input.length && this.input[this.cursor] !== quote) {
            this.cursor++;
        }
        let val = this.input.slice(start, this.cursor);
        this.cursor++; // Skip close quote
        return { type: TokenType.STRING, value: val, line: this.line };
    }

    readFString() {
        this.cursor++; // Skip 'f'
        const quote = this.input[this.cursor];
        this.cursor++; // Skip quote
        let start = this.cursor;
        while (this.cursor < this.input.length && this.input[this.cursor] !== quote) {
            this.cursor++;
        }
        let val = this.input.slice(start, this.cursor);
        this.cursor++; // Skip close quote
        return { type: TokenType.FSTRING, value: val, line: this.line };
    }

    readNumber() {
        let start = this.cursor;
        while (this.cursor < this.input.length && /[\d.]/.test(this.input[this.cursor])) {
            this.cursor++;
        }
        let val = this.input.slice(start, this.cursor);
        return { type: TokenType.NUMBER, value: val, line: this.line };
    }

    readIdentifier() {
        let start = this.cursor;
        while (this.cursor < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.cursor])) {
            this.cursor++;
        }
        let val = this.input.slice(start, this.cursor);

        if (KEYWORDS.has(val)) return { type: TokenType.KEYWORD, value: val, line: this.line };
        if (TYPES.has(val)) return { type: TokenType.TYPE, value: val, line: this.line };
        return { type: TokenType.IDENTIFIER, value: val, line: this.line };
    }
}

module.exports = { Lexer, TokenType };
