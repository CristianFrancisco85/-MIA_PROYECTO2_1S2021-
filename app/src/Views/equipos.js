import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container,Select,MenuItem} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Deportes extends Component {



    constructor(props){
        super(props)
        this.state = {
            nombre:'',
            idDeporte:'',
            deportes:[],
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'nombre', headerName: 'Nombre de Equipo', width: 130 },
                { field: 'IdDeporte', headerName: 'ID Deporte', width: 130 },
            ]
        }
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createEquipo/${this.state.nombre}/${this.state.idDeporte}`,
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
            await fetch(`http://localhost:8080/deportes`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({deportes:data})
                }
            });
        }
        catch(error){
            console.error(error)
        }

        try{
            await fetch(`http://localhost:8080/equipos`,
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
                    <Link component={LinkRouter} to="/equipos" color="inherit"> Equipos </Link>
                    <Link component={LinkRouter} to="/deportes" color="inherit"> Deportes </Link>
                    <Link component={LinkRouter} to="/temporadas" color="inherit"> Temporadas </Link>
                    <Link component={LinkRouter} to="/jornadas" color="inherit"> Jornada </Link>
                    <Link component={LinkRouter} to="/eventos" color="inherit"> Eventos </Link>
                    <Link component={LinkRouter} to="/recompensas" color="inherit"> Recompensas </Link>
                    <Link component={LinkRouter} to="/" color="inherit"> Log-Out </Link>
                </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="sm" style={{marginTop:20}}>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                <Typography component="h1" variant="h5">Crear Equipo</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Nombre"
                    autoFocus
                    onChange={(e)=> this.setState({nombre:e.target.value}) }
                />
                <Typography component="h1" variant="h6">Deporte</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    label="Deporte"  
                    onChange={(e)=> this.setState({idDeporte:e.target.value})}
                >
                    {this.state.deportes.map((item)=>{
                        return(
                            <MenuItem value={item.id}>{item.nombre}</MenuItem>
                        )
                    })}
                </Select>

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


