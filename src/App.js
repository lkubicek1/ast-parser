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
    TextField,
    Typography
} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const useStyles = makeStyles({
    cardContent: {
        minWidth: '377px',
        minHeight: '610px',
    },
});

function App() {

    const [input, setInput] = useState('');
    const [ast, setAst] = useState(null);
    const [tokens, setTokens] = useState([]);

    const tokenizer = new Tokenizer();
    const parser = new Parser();

    const classes = useStyles();
    const processInput = entry => {
        try {
            setInput(entry);
            if (!entry || entry.length === 0) {
                setTokens([]);
                setAst(null);
            } else {
                const tokenizedInput = tokenizer.tokenize(entry);
                const parsedInput = parser.translate(entry);

                setTokens(tokenizedInput);
                setAst(parsedInput);
            }
        } catch (error) {
            if (entry && entry.length === 0) {
                setTokens([]);
                setAst(null);
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
                            <Grid item xs={6}>
                                <Typography variant="h6">Tokens</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">Syntax Tree</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Card>
                                    <CardContent className={classes.cardContent}>
                                        <List>
                                            {tokens.map(({type, value}, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={`${type}: ${value}`}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card>
                                    <CardContent className={classes.cardContent}>
                                        <pre style={{padding: '11px'}}>{ast ? JSON.stringify(ast, null, 2) : ''}</pre>
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
