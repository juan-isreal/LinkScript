// src/transpiler.js

class Transpiler {
    transpile(node) {
        if (!node) return '';

        switch (node.type) {
            case 'Program':
                return node.body.map(stmt => this.transpile(stmt)).join('\n');

            case 'VariableDeclaration':
                const declKeyword = node.isConst ? 'const' : 'let';
                return `${declKeyword} ${node.name} =${this.transpile(node.initializer)};`;

            case 'Assignment':
                return `${node.name} =${this.transpile(node.value)};`;

            case 'FunctionDeclaration':
                const params = node.params.join(', ');
                const body = node.body.map(stmt => this.transpile(stmt)).join('\n  ');
                return `function ${node.name}(${params}) {\n${body}\n}`;

            case 'PrintStatement':
                return `console.log(${this.transpile(node.argument)});`;

            case 'IfStatement':
                const consequent = node.consequent.map(stmt => this.transpile(stmt)).join('\n  ');
                let code = `if (${this.transpile(node.condition)}) {\n${consequent}\n}`;
                if (node.alternate) {
                    const alternate = node.alternate.map(stmt => this.transpile(stmt)).join('\n  ');
                    code += ` else {\n  ${alternate}\n}`;
                }
                return code;

            case 'WhileStatement':
                const loopBody = node.body.map(stmt => this.transpile(stmt)).join('\n  ');
                return `while (${this.transpile(node.condition)}) {\n${loopBody}\n}`;

            case 'BinaryExpression':
                return `${this.transpile(node.left)} ${node.operator}${this.transpile(node.right)}`;

            case 'CallExpression':
                const args = node.arguments.map(arg => this.transpile(arg)).join(', ');
                return `${node.callee}(${args})`;

            case 'Identifier':
                return node.name;

            case 'Literal':
                return typeof node.value === 'string' ? JSON.stringify(node.value) : node.value;

            case 'FStringLiteral':
                // Convert Python-style f"" into JavaScript template literal backticks ``
                // Replace {var} with ${var}
                const jsTemplate = node.value.replace(/\{([^}]+)\}/g, '${$1}');
                return `\`${jsTemplate}\``;

            case 'ExpressionStatement':
                return `${this.transpile(node.expression)};`;

            default:
                throw new Error(`[Transpiler Error] Unknown AST node type: ${node.type}`);
        }
    }
}

module.exports = { Transpiler };
