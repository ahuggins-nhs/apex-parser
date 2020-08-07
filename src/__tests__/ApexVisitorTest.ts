import { ApexLexer } from "../ApexLexer";
import { ApexParserListener } from "../ApexParserListener";
import { ApexParser, MethodDeclarationContext } from "../ApexParser";
import { CaseInsensitiveInputStream } from "../CaseInsensitiveInputStream"
import { CommonTokenStream } from 'antlr4ts';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ThrowingErrorListener } from "../ThrowingErrorListener";
import { ApexParserVisitor } from "../ApexParserVisitor";

class TestVisitor extends AbstractParseTreeVisitor<number> implements ApexParserVisitor<number> {
    public methodCount = 0

    visitMethodDeclaration(ctx: MethodDeclarationContext): number {
        this.methodCount += 1;
        return 1 + super.visitChildren(ctx)
    }

    defaultResult() {
        return 0
    }
}

test('Vistor is visited', () => {

    let lexer = new ApexLexer(new CaseInsensitiveInputStream("test.cls", "public class Hello {}"))
    let tokens = new CommonTokenStream(lexer);

    let parser = new ApexParser(tokens)

    parser.removeErrorListeners()
    parser.addErrorListener(new ThrowingErrorListener());

    const cu = parser.compilationUnit()
    const visitor = new TestVisitor()
    visitor.visit(cu)

    expect(visitor.methodCount == 1)
})