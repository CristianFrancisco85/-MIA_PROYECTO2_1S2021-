import React, { Component } from 'react'
import {Button,Typography,Grid,Box,Input,Container,TextField} from '@material-ui/core'
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

export default class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            loginAuth:false
        }
        
        
    }

    render() {

        return (
            <Container component="main" maxWidth="sm" style={{marginTop:250}}>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Sign In
                </Button>
          </Container>
        )
    }
}
