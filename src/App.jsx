import CssBaseline from '@mui/material/CssBaseline';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material';
import { useState } from 'react';
import sampleUsers from './data/sampleUsers.json';
import { Parser } from './services/Parser';
import { SearchInterpreter } from './services/SearchInterpreter';
import { Tokenizer } from './services/Tokenizer';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7dd3fc',
        },
        background: {
            default: '#020617',
            paper: '#0f172a',
        },
    },
    shape: {
        borderRadius: 18,
    },
});

const COLUMNS = ['name', 'email', 'age'];
const panelSx = {
    minHeight: 440,
    borderRadius: 4,
    borderColor: 'divider',
    backgroundImage: 'none',
};
const monoFontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace';

function sortUsers(rows) {
    return [...rows].sort((left, right) => left.name.localeCompare(right.name));
}

const allData = sortUsers(sampleUsers);

function getDefaultViewState() {
    return {
        tokens: [],
        ast: null,
        data: allData,
        error: '',
    };
}

function evaluateQuery(query) {
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
        data: sortUsers(allData.filter(filter)),
        error: '',
    };
}

function App() {
    const [input, setInput] = useState('');
    const [tokens, setTokens] = useState([]);
    const [ast, setAst] = useState(null);
    const [data, setData] = useState(allData);
    const [error, setError] = useState('');

    const processInput = (nextValue) => {
        setInput(nextValue);

        try {
            const nextState = evaluateQuery(nextValue);
            setTokens(nextState.tokens);
            setAst(nextState.ast);
            setData(nextState.data);
            setError(nextState.error);
        } catch (inputError) {
            const message = inputError instanceof Error ? inputError.message : 'Unable to parse the current expression.';

            setTokens([]);
            setAst(null);
            setData(allData);
            setError(message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 } }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Box>
                            <Typography color="primary.main" variant="overline">
                                Boolean AST Playground
                            </Typography>
                            <Typography sx={{ fontWeight: 700, mt: 1 }} variant="h3">
                                Simple Boolean Expression Parser
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 780, mt: 1.5 }}>
                                Tokenize boolean expressions, inspect the generated syntax tree, and verify the compiled
                                filter against a sample dataset in one place.
                            </Typography>
                        </Box>

                        <Paper elevation={0} sx={{ borderRadius: 5, border: 1, borderColor: 'divider', p: { xs: 2, md: 3 } }}>
                            <Stack spacing={3}>
                                <TextField
                                    error={Boolean(error)}
                                    fullWidth
                                    helperText={error || 'Try: (alice OR bob) AND gmail'}
                                    label="Enter boolean expression"
                                    onChange={({ target }) => processInput(target.value)}
                                    placeholder="name AND gmail OR 42"
                                    value={input}
                                />

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            lg: 'repeat(3, minmax(0, 1fr))',
                                        },
                                    }}
                                >
                                    <Paper elevation={0} sx={panelSx} variant="outlined">
                                        <Stack spacing={1.5} sx={{ height: '100%', p: 2.5 }}>
                                            <Typography variant="h6">Tokens</Typography>
                                            <Typography color="text.secondary" variant="body2">
                                                The tokenizer output in the order it was consumed.
                                            </Typography>
                                            {tokens.length > 0 ? (
                                                <List dense disablePadding sx={{ overflowY: 'auto' }}>
                                                    {tokens.map(({ type, value }, index) => (
                                                        <ListItem
                                                            disablePadding
                                                            key={`${type}-${value}-${index}`}
                                                            sx={{
                                                                borderBottom: 1,
                                                                borderColor: 'divider',
                                                                py: 1,
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={`${index + 1}. ${type}: ${value}`}
                                                                primaryTypographyProps={{ fontFamily: monoFontFamily }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography color="text.secondary" sx={{ mt: 6 }} variant="body2">
                                                    Enter a query to inspect the lexer output.
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Paper>

                                    <Paper elevation={0} sx={panelSx} variant="outlined">
                                        <Stack spacing={1.5} sx={{ height: '100%', p: 2.5 }}>
                                            <Typography variant="h6">Syntax Tree</Typography>
                                            <Typography color="text.secondary" variant="body2">
                                                Recursive descent output serialized as JSON.
                                            </Typography>
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: 1,
                                                    borderColor: 'divider',
                                                    borderRadius: 3,
                                                    flex: 1,
                                                    overflow: 'auto',
                                                    p: 2,
                                                }}
                                            >
                                                <Typography
                                                    component="pre"
                                                    sx={{
                                                        color: ast ? 'text.primary' : 'text.secondary',
                                                        fontFamily: monoFontFamily,
                                                        fontSize: 13,
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                    }}
                                                    variant="body2"
                                                >
                                                    {ast ? JSON.stringify(ast, null, 2) : 'Enter a query to inspect the AST.'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>

                                    <Paper elevation={0} sx={panelSx} variant="outlined">
                                        <Stack spacing={1.5} sx={{ height: '100%', p: 2.5 }}>
                                            <Typography variant="h6">Filtered Data</Typography>
                                            <Typography color="text.secondary" variant="body2">
                                                Matches produced by the compiled filter function.
                                            </Typography>
                                            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell align="right">Age</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.length > 0 ? (
                                                            data.map((row) => (
                                                                <TableRow hover key={`${row.email}-${row.age}`}>
                                                                    <TableCell component="th" scope="row">
                                                                        {row.name}
                                                                    </TableCell>
                                                                    <TableCell sx={{ wordBreak: 'break-word' }}>
                                                                        {row.email}
                                                                    </TableCell>
                                                                    <TableCell align="right">{row.age}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell align="center" colSpan={3}>
                                                                    No rows match the current expression.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Stack>
                                    </Paper>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
