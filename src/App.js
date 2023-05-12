import {createTheme, ThemeProvider} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useState} from "react";
import {Tokenizer} from "./services/Tokenizer";
import {Parser} from "./services/Parser";
import {
    Box,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {faker} from '@faker-js/faker';
import {SearchInterpreter} from "./services/SearchInterpreter";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const useStyles = makeStyles({
    cardContent: {
        minWidth: '377px',
        minHeight: '700px',
    },
});

function createRandomUser() {
    return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        age: faker.number.int({min: 20, max: 80})
    };
}

const generateData = (numRows) => {
    const data = [];
    for (let i = 0; i < numRows; i++) {
        data.push(createRandomUser());
    }
    return data;
}

const allData = generateData(10);

const nameSorting = (a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
};

const COLUMNS = ['name', 'email', 'age'];

function App() {

    const [input, setInput] = useState('');
    const [ast, setAst] = useState(null);
    const [tokens, setTokens] = useState([]);

    const [data, setData] = useState(allData.sort(nameSorting));

    const tokenizer = new Tokenizer();
    const parser = new Parser();
    const interpreter = new SearchInterpreter();

    const classes = useStyles();

    const processInput = entry => {
        try {
            setInput(entry);
            if (!entry || entry.length === 0) {
                setTokens([]);
                setAst(null);
                setData(allData.sort(nameSorting));
            } else {
                const tokenizedInput = tokenizer.tokenize(entry);
                const parsedInput = parser.translate(entry);

                setTokens(tokenizedInput);
                setAst(parsedInput);

                const filter = interpreter.compile(entry, COLUMNS);
                setData(allData.filter(filter).sort(nameSorting));

            }
        } catch (error) {
            if (entry && entry.length === 0) {
                setTokens([]);
                setAst(null);
                setData(allData.sort(nameSorting))
            }
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <main>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{minHeight: '100vh'}}
                >
                    <Box border={1} borderColor="white" borderRadius={5} p={2}>
                        <Typography variant="h4">Simple Boolean Expression Parser</Typography>
                        <TextField
                            variant="outlined"
                            label="Enter boolean expression"
                            value={input}
                            onChange={({target: {value}}) => processInput(value)}
                            fullWidth
                            margin="dense"
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography variant="h6">Tokens</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h6">Syntax Tree</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h6">Filtered Data</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent className={classes.cardContent}>
                                        <List>
                                            {tokens.map(({type, value}, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={`${index + 1}. ${type}: ${value}`}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent className={classes.cardContent}>
                                        <pre style={{padding: '11px'}}>{ast ? JSON.stringify(ast, null, 2) : ''}</pre>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent className={classes.cardContent}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Email</TableCell>
                                                        <TableCell align="right">Age</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.email}
                                                            </TableCell>
                                                            <TableCell align="right">{row.age}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </main>
        </ThemeProvider>
    );
}

export default App;
