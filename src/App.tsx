import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import sampleUsers from '@/data/sampleUsers.json';
import { Parser, type ProgramNode } from '@/services/Parser';
import { SearchInterpreter } from '@/services/SearchInterpreter';
import { Tokenizer, type Token } from '@/services/Tokenizer';

type UserRow = (typeof sampleUsers)[number];

type ViewState = {
  tokens: Token[];
  ast: ProgramNode | null;
  data: UserRow[];
  error: string;
};

const COLUMNS = ['name', 'email', 'age'] as const satisfies readonly (keyof UserRow)[];

function sortUsers(rows: readonly UserRow[]): UserRow[] {
  return [...rows].sort((left, right) => left.name.localeCompare(right.name));
}

const allData = sortUsers(sampleUsers);

function getDefaultViewState(): ViewState {
  return {
    tokens: [],
    ast: null,
    data: allData,
    error: '',
  };
}

function evaluateQuery(query: string): ViewState {
  if (!query.trim()) {
    return getDefaultViewState();
  }

  const tokenizer = new Tokenizer();
  const parser = new Parser();
  const interpreter = new SearchInterpreter();
  const tokens = tokenizer.tokenize(query);
  const ast = parser.translate(query);
  const filter = interpreter.compile(query, COLUMNS);

  return {
    tokens,
    ast,
    data: sortUsers(allData.filter((row) => filter(row))),
    error: '',
  };
}

function App() {
  const [input, setInput] = useState('');
  const [viewState, setViewState] = useState<ViewState>(getDefaultViewState);

  const { tokens, ast, data, error } = viewState;

  const processInput = (nextValue: string) => {
    setInput(nextValue);

    try {
      setViewState(evaluateQuery(nextValue));
    } catch (inputError) {
      const message = inputError instanceof Error ? inputError.message : 'Unable to parse the current expression.';

      setViewState({
        ...getDefaultViewState(),
        error: message,
      });
    }
  };

  const hasQuery = input.trim().length > 0;
  const runtimeStatus = error
    ? {
        label: 'SYNTAX ERROR',
        textClassName: 'text-destructive',
        dotClassName: 'bg-destructive',
        detail: error,
      }
    : hasQuery
      ? {
          label: 'QUERY ACTIVE',
          textClassName: 'text-[#00ff41]',
          dotClassName: 'bg-[#00ff41]',
          detail: 'Compiled filter is running against the sample dataset.',
        }
      : {
          label: 'READY',
          textClassName: 'text-[#00ff41]',
          dotClassName: 'bg-[#00ff41]',
          detail: 'Waiting for a boolean expression.',
        };

  const metrics = [
    { label: 'TOKENS', value: tokens.length },
    { label: 'MATCHES', value: data.length },
    { label: 'FIELDS', value: COLUMNS.length },
  ];

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b-2 border-primary">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-0 md:px-0 md:py-0">
          <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:gap-6 md:px-4 md:py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:pr-12">
              <div className="size-2 animate-pulse bg-[#00ff41]" />
              <h1 className="font-medium text-primary">AST Parser</h1>
              <div className="text-xs">v0.1.0</div>
            </div>
            <nav className="grid grid-cols-3 gap-2 text-muted-foreground md:flex md:items-center md:gap-3">
              <span className="inline-flex items-center justify-center border border-border/70 bg-primary px-2.5 py-1 text-center text-[11px] tracking-[0.14em] text-primary-foreground uppercase md:border-0 md:px-2 md:py-1 md:text-sm md:tracking-normal md:normal-case">
                Parser
              </span>
              <span className="inline-flex items-center justify-center border border-border/40 px-2.5 py-1 text-center text-[11px] tracking-[0.14em] text-muted-foreground/50 uppercase md:border-0 md:px-0 md:py-0 md:text-sm md:tracking-normal md:normal-case">
                Tokens
              </span>
              <span className="inline-flex items-center justify-center border border-border/40 px-2.5 py-1 text-center text-[11px] tracking-[0.14em] text-muted-foreground/50 uppercase md:border-0 md:px-0 md:py-0 md:text-sm md:tracking-normal md:normal-case">
                Dataset
              </span>
            </nav>
          </div>

          <div className="flex w-full flex-col gap-2 border-t border-border/70 pt-3 text-[11px] tabular-nums md:w-auto md:border-t-0 md:px-4 md:py-3 md:text-xs">
            <div className={cn('inline-flex items-center gap-1.5 whitespace-nowrap font-medium', runtimeStatus.textClassName)}>
              <span className={cn('size-1.5 rounded-full', runtimeStatus.dotClassName)} />
              <span>{runtimeStatus.label}</span>
            </div>
            <div className="flex flex-col gap-1 md:gap-0.5">
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>ROWS</span>
                <span className="text-right text-foreground">{allData.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>FIELDS</span>
                <span className="text-right text-foreground">{COLUMNS.join(', ').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-5 sm:p-6">
        <section className="space-y-6">
          <section className="border border-primary/30 bg-card p-4 text-card-foreground shadow-[0_18px_50px_-34px_rgba(243,144,0,0.55)] md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className="text-lg leading-none tracking-[0.28em] text-primary">BOOLEAN QUERY MODULE</h2>
                  <div className="inline-flex items-center gap-1 text-[9px] leading-none tracking-[0.18em] text-muted-foreground">
                    <div className={cn('size-1.5 animate-pulse', runtimeStatus.dotClassName)} />
                    {runtimeStatus.label}
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-5 text-muted-foreground">
                  Tokenize boolean expressions, inspect the generated syntax tree, and verify the compiled filter against a sample dataset in one place.
                </p>
              </div>

              <div className="w-full max-w-md border border-border bg-background px-4 py-3">
                <div className="space-y-3 text-xs">
                  <div className="text-[10px] tracking-[0.18em] text-muted-foreground">REFERENCE QUERY</div>
                  <div className="text-sm text-foreground">(alice OR bob) AND gmail</div>
                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
                    {metrics.map((metric) => (
                      <div className="space-y-1" key={metric.label}>
                        <div className="tracking-[0.16em]">{metric.label}</div>
                        <div className="text-base text-foreground">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-[10px] tracking-[0.18em] text-muted-foreground" htmlFor="query-input">
                ENTER BOOLEAN EXPRESSION
              </label>
              <Input
                aria-describedby="query-help"
                aria-invalid={Boolean(error)}
                className="border-primary/30 bg-background text-foreground"
                id="query-input"
                onChange={({ target }) => processInput(target.value)}
                placeholder="name AND gmail OR 42"
                value={input}
              />
              <p className={cn('text-sm leading-5', error ? 'text-destructive' : 'text-muted-foreground')} id="query-help">
                {error || runtimeStatus.detail}
              </p>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr_1.2fr]">
            <Card className="min-h-[28rem] bg-card/95">
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
                <CardDescription>The tokenizer output in the order it was consumed.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                {tokens.length > 0 ? (
                  <div className="bg-background flex-1 overflow-hidden border">
                    <ul className="divide-border h-full divide-y overflow-auto">
                      {tokens.map(({ type, value }, index) => (
                        <li className="px-4 py-3 text-xs leading-5 md:text-sm" key={`${type}-${value}-${index}`}>
                          <span className="text-muted-foreground mr-2">{String(index + 1).padStart(2, '0')}.</span>
                          <span className="text-primary">{type}</span>
                          <span className="text-muted-foreground mx-2">::</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-1 items-center justify-center border px-6 text-center text-xs leading-6 md:text-sm">
                    Enter a query to inspect the lexer output.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="min-h-[28rem] bg-card/95">
              <CardHeader>
                <CardTitle>Syntax Tree</CardTitle>
                <CardDescription>Recursive descent output serialized as readable JSON.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <div className="bg-background flex-1 overflow-auto border p-4">
                  <pre className={cn('text-xs leading-5 whitespace-pre-wrap break-words md:text-sm md:leading-6', ast ? 'text-foreground' : 'text-muted-foreground')}>
                    {ast ? JSON.stringify(ast, null, 2) : 'Enter a query to inspect the AST.'}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-[28rem] bg-card/95">
              <CardHeader>
                <CardTitle>Filtered Data</CardTitle>
                <CardDescription>
                  {hasQuery ? 'Matches produced by the compiled filter function.' : 'Sample records are shown until a query is applied.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <div className="flex-1 overflow-hidden border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length > 0 ? (
                        data.map((row) => (
                          <TableRow key={`${row.email}-${row.age}`}>
                            <TableCell className="text-xs font-medium md:text-sm">{row.name}</TableCell>
                            <TableCell className="break-all text-xs text-muted-foreground md:text-sm">{row.email}</TableCell>
                            <TableCell className="text-right text-xs md:text-sm">{row.age}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell className="text-muted-foreground py-8 text-center text-xs md:text-sm" colSpan={3}>
                            No rows match the current expression.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
