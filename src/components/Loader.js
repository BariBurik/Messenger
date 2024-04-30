import { Button, Container, Grid, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import "./Loader.css"

function Loader() {
    return ( 
        <Container>
            <Grid container
                style={{height: window.innerHeight - 50}}
                alignItems={"center"}
                justifyContent={"center"}>
                    <Grid 
                        container
                        alignItems={"center"}
                        justifyContent={"center"}
                        >
                        <span class="loader"></span>
                    </Grid>
            </Grid>
        </Container>
     );
} 

export default Loader;