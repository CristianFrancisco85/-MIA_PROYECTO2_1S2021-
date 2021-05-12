import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Link} from '@material-ui/core'
import {BrowserRouter as Router,Switch,Route,Link as LinkRouter} from "react-router-dom";


export default class Menu extends Component {

    constructor(props){
        super(props)

    }


    async handleSubmit(e){
        
    }

    render() {

        return (
            <React.Fragment>
                <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="mr-3">
                    Dashboard
                    </Typography>
                    
                    <Link component={LinkRouter} to="/mensajes" color="inherit"> Mensajes </Link>
                    <Link component={LinkRouter} to="/predicciones" color="inherit"> Predicciones </Link>
                    <Link component={LinkRouter} to="/" color="inherit"> Log-Out </Link>
                </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}
