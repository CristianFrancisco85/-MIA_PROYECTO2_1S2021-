import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Mensajes extends Component {



    constructor(props){
        super(props)
        this.state = {
            username:localStorage.getItem("username"),
            contenido:'',
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'contenido', headerName: 'Contenido', width: 1000 },
                { field: 'fecha', headerName: 'Fecha', width: 130 },
            ]
        }
        
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/sendMessage/${this.state.username}/admin/${this.state.contenido}`,
            {   
                method:'POST'
            })
            .then(response => response.json())
            .then(data => {
                if(data.Res){
                    alert("Se ha ingresado exitosamente")
                    this.componentDidMount()
                }
                else{
                    alert("Error: No se ha podido ingresar")
                }
            });
        }
        catch(error){
            console.error(error)
        }
    }

    async componentDidMount(){
        try{
            await fetch(`http://localhost:8080/getMensajes/${this.state.username}`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({rows:data})
                }
            });
        }
        catch(error){
            console.error(error)
        }
    }

    render() {

        return (
            <React.Fragment>
                <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                    Dashboard
                    </Typography>
                    <Link component={LinkRouter} to="/mensajesAdmin" color="inherit"> Mensajes </Link>
                    <Link component={LinkRouter} to="/predicciones" color="inherit"> Predicciones </Link>
                    <Link component={LinkRouter} to="/" color="inherit"> Log-Out </Link>
                </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="sm" style={{marginTop:20}}>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                <Typography component="h1" variant="h5">Enviar Mensaje</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Nombre"
                    autoFocus
                    multiline
                    onChange={(e)=> this.setState({contenido:e.target.value}) }
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Ingresar
                </Button>
                </form>

                </Container>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid getRowId={(row) => row.id} rows={this.state.rows} columns={this.state.columns} pageSize={20} checkboxSelection/>   
                </div>
                

            </React.Fragment>
        )
    }
}


