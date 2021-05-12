import React, { Component } from 'react'
import {Button,Typography,Grid,Box,Input,Container,TextField} from '@material-ui/core'
import {BrowserRouter as Router} from "react-router-dom";

export default class CreateAccount extends Component {

    constructor(props){
        super(props)
        this.state ={
            nombre:'',
            apellido:'',
            username:'',
            password:'',
            correo:'',
            nacimiento:''
        }
    }

    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createCliente/${this.state.nombre}/${this.state.apellido}/${this.state.username}/${this.state.password}/${this.state.correo}/${this.state.nacimiento}`,
            {   
                method:'POST'
            })
            .then(response => response.json())
            .then(data => {
                if(data.Res){
                    alert("Usuario Creado")
                    this.props.history.push("/");
                }
                else{
                    alert("Error: No se pudo crear al usuario")
                }
            });
        }
        catch(error){
            console.error(error)
        }
        
        
    }


    render(){
        return(
            <Container component="main" maxWidth="sm" style={{marginTop:250}}>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                <Typography component="h1" variant="h5">Crear cuenta de Cliente</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Nombre"
                    autoFocus
                    onChange={(e)=> this.setState({nombre:e.target.value}) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Apellido"
                    onChange={(e)=> this.setState({apellido:e.target.value}) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    onChange={(e)=> this.setState({username:e.target.value}) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type='password'
                    onChange={(e)=> this.setState({password:e.target.value}) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Correo"
                    onChange={(e)=> this.setState({correo:e.target.value}) }
                />
                 <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="date"
                    label="Fecha de Nacimiento"
                    onChange={(e)=> this.setState({nacimiento:e.target.value.replace('/','.')}) }
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Registrar
                </Button>
                </form>
            </Container>
        )
    }

}
