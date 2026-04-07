import { Parser, type AstNode } from './Parser';

type SearchableRecord = Record<string, unknown>;
type CompiledFilter = (row: SearchableRecord) => boolean;

export class SearchInterpreter {
  private _parser = new Parser();

  compile(query: string, columns: readonly string[] = []): CompiledFilter {
    const ast = this._parser.translate(query);
    const activeColumns = columns.length > 0 ? new Set(columns) : null;

    return this._dig(ast, activeColumns);
  }

  private _dig(ast: AstNode, columns: ReadonlySet<string> | null): CompiledFilter {
    if (ast.type === 'program') {
      return this._dig(ast.body.expression, columns);
    }

    if (ast.type === 'expr') {
      return this._dig(ast.expression, columns);
    }

    if (ast.type === 'boolean_expr') {
      const leftFilter = this._dig(ast.left, columns);
      const rightFilter = this._dig(ast.right, columns);

      if (ast.operator.value.toUpperCase() === 'AND') {
        return (obj) => leftFilter(obj) && rightFilter(obj);
      }

      if (ast.operator.value.toUpperCase() === 'OR') {
        return (obj) => leftFilter(obj) || rightFilter(obj);
      }

      throw new Error(`Unknown operator: ${ast.operator.value}`);
    }

    if (ast.type === 'operand') {
      return (obj) =>
        Object.entries(obj)
          .filter(([key]) => !columns || columns.has(key))
          .map(([, value]) => value)
          .filter((value) => value !== null && value !== undefined)
          .map((value) => String(value).toLowerCase())
          .some((value) => value.includes(String(ast.value).toLowerCase()));
    }

    throw new Error('Unknown node type');
  }
}
