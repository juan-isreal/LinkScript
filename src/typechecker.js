// src/typechecker.js

class TypeChecker {
    constructor() {
        // Scope symbol table: name -> { type, isConst }
        this.scopes = [new Map()];
    }

    enterScope() {
        this.scopes.push(new Map());
    }

    exitScope() {
        this.scopes.pop();
    }

    declare(name, type, isConst) {
        const currentScope = this.scopes[this.scopes.length - 1];
        if (currentScope.has(name)) {
            throw new Error(`[Type Error] Variable '${name}' is already declared in this scope.`);
        }
        currentScope.set(name, { type, isConst });
    }

    lookup(name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) {
                return this.scopes[i].get(name);
            }
        }
        return null;
    }

    check(node) {
        if (!node) return;

        switch (node.type) {
            case 'Program':
                for (const stmt of node.body) {
                    this.check(stmt);
                }
                break;

            case 'VariableDeclaration':
                this.check(node.initializer);
                const initType = node.initializer.valueType || 'any';
                
                // If explicit type was provided, validate it matches initializer
                if (node.varType && initType !== 'any') {
                    if (node.varType === 'int' && initType !== 'int') {
                        throw new Error(`[Type Error] Cannot assign '${initType}' to strict 'int' variable '${node.name}'`);
                    }
                    if (node.varType === 'string' && initType !== 'string') {
                        throw new Error(`[Type Error] Cannot assign '${initType}' to strict 'string' variable '${node.name}'`);
                    }
                    if (node.varType === 'float' && initType !== 'float' && initType !== 'int') {
                        throw new Error(`[Type Error] Cannot assign '${initType}' to strict 'float' variable '${node.name}'`);
                    }
                }

                const assignedType = node.varType || initType;
                this.declare(node.name, assignedType, node.isConst);
                break;

            case 'Assignment':
                const existing = this.lookup(node.name);
                if (!existing) {
                    throw new Error(`[Type Error] Variable '${node.name}' used without declaration.`);
                }
                if (existing.isConst) {
                    throw new Error(`[Type Error] Cannot reassign constant variable '${node.name}'.`);
                }
                this.check(node.value);
                break;

            case 'FunctionDeclaration':
                this.enterScope();
                for (const param of node.params) {
                    this.declare(param, 'any', false);
                }
                for (const stmt of node.body) {
                    this.check(stmt);
                }
                this.exitScope();
                break;

            case 'PrintStatement':
                this.check(node.argument);
                break;

            case 'IfStatement':
                this.check(node.condition);
                this.enterScope();
                for (const stmt of node.consequent) {
                    this.check(stmt);
                }
                this.exitScope();
                if (node.alternate) {
                    this.enterScope();
                    for (const stmt of node.alternate) {
                        this.check(stmt);
                    }
                    this.exitScope();
                }
                break;

            case 'WhileStatement':
                this.check(node.condition);
                this.enterScope();
                for (const stmt of node.body) {
                    this.check(stmt);
                }
                this.exitScope();
                break;

            case 'BinaryExpression':
                this.check(node.left);
                this.check(node.right);
                node.valueType = 'any';
                break;

            case 'CallExpression':
                for (const arg of node.arguments) {
                    this.check(arg);
                }
                break;

            case 'Identifier':
                const sym = this.lookup(node.name);
                if (!sym) {
                    throw new Error(`[Type Error] Undeclared identifier '${node.name}'.`);
                }
                node.valueType = sym.type;
                break;

            case 'Literal':
            case 'FStringLiteral':
                // Already has valueType set by parser
                break;
        }
    }
}

module.exports = { TypeChecker };
