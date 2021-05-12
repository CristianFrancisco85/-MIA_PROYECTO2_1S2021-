import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Link} from '@material-ui/core'
import {BrowserRouter as Router,Switch,Route,Link as LinkRouter} from "react-router-dom";


export default class Dashboard extends Component {

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
                    
                    <Link component={LinkRouter} to="/mensajesAdmin" color="inherit"> Mensajes </Link>
                    <Link component={LinkRouter} to="/equipos" color="inherit"> Equipos </Link>
                    <Link component={LinkRouter} to="/deportes" color="inherit"> Deportes </Link>
                    <Link component={LinkRouter} to="/temporadas" color="inherit"> Temporadas </Link>
                    <Link component={LinkRouter} to="/jornadas" color="inherit"> Jornada </Link>
                    <Link component={LinkRouter} to="/eventos" color="inherit"> Eventos </Link>
                    <Link component={LinkRouter} to="/recompensas" color="inherit"> Recompensas </Link>
                    <Link component={LinkRouter} to="/" color="inherit"> Log-Out </Link>
                </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}
