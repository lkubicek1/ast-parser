export type TokenType = 'open_paren' | 'close_paren' | 'or_operator' | 'and_operator' | 'operand';

export type Token =
  | { type: 'open_paren'; value: string }
  | { type: 'close_paren'; value: string }
  | { type: 'or_operator'; value: string }
  | { type: 'and_operator'; value: string }
  | { type: 'operand'; value: string };

type TokenSpec = {
  regex: RegExp;
  type: TokenType | null;
};

const SPEC: TokenSpec[] = [
  { regex: /^\(/, type: 'open_paren' },
  { regex: /^\)/, type: 'close_paren' },
  { regex: /^\sOR\s/i, type: 'or_operator' },
  { regex: /^\sAND\s/i, type: 'and_operator' },
  { regex: /^(.*?)\sAND\s(.*?)\sOR\s/i, type: 'operand' },
  { regex: /^(.*?)\sOR\s/i, type: 'operand' },
  { regex: /^(.*?)\sAND\s/i, type: 'operand' },
  { regex: /(.*)/, type: 'operand' },
];

export class Tokenizer {
  private _cursor = 0;
  private _string = '';

  init(): void {
    this._cursor = 0;
  }

  tokenize(string: string): Token[] {
    this._string = string;
    this._cursor = 0;
    const tokens: Token[] = [];

    while (this._hasMoreTokens()) {
      const token = this._getNextToken();

      if (token == null) {
        break;
      }

      tokens.push(token);
    }

    return tokens;
  }

  private _hasMoreTokens(): boolean {
    return this._cursor < this._string.length;
  }

  private _getNextToken(): Token | null {
    if (!this._hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const { regex, type } of SPEC) {
      const value = this._match(regex, string);

      if (value == null) {
        continue;
      }

      if (type == null) {
        return this._getNextToken();
      }

      return { type, value };
    }

    throw new SyntaxError(`Unexpected token: "${string}"`);
  }

  private _match(regex: RegExp, string: string): string | null {
    const matched = regex.exec(string);

    if (matched == null) {
      return null;
    }

    const index = matched.length > 1 ? 1 : 0;
    const nextValue = matched[index];

    if (!nextValue || nextValue.length === 0) {
      return null;
    }

    const value = nextValue === ')' ? nextValue : nextValue.replace(')', '');
    this._cursor += value.length;
    return value.trim();
  }
}
