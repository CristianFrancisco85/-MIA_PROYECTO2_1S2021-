import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container,Select,MenuItem} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Jornadas extends Component {



    constructor(props){
        super(props)
        this.state = {
            Nombre:'',
            Estado:'',
            idtemporada:0,
            temporadas:[],
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'nombre', headerName: 'Nombre', width: 130 },
                { field: 'estado', headerName: 'Estado', width: 130 },
                { field: 'idtemporada', headerName: 'Temporada', width: 130 },
            ]
        }
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createJornada/${this.state.Nombre}/${this.state.Estado}/${this.state.idtemporada}`,
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
            await fetch(`http://localhost:8080/jornadas`,
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
        try{
            await fetch(`http://localhost:8080/temporadas`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({temporadas:data})
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
                <Typography component="h1" variant="h5">Crear Jornada</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Nombre"
                    autoFocus
                    onChange={(e)=> this.setState({Nombre:e.target.value}) }
                />
                <Typography component="h1" variant="h6">Estado</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    style={{width:150}}
                    label="Estado"  
                    onChange={(e)=> this.setState({Estado:e.target.value})}
                >
                    <MenuItem value="Activa">Activa</MenuItem>
                    <MenuItem value="Inactiva">Inactiva</MenuItem>
                </Select>
                <Typography component="h1" variant="h6">Temporada</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    style={{width:150}}
                    label="Temporada"  
                    onChange={(e)=> this.setState({idtemporada:e.target.value})}
                >
                    {this.state.temporadas.map((item)=>{
                        return(<MenuItem value={item.id}>{item.año}</MenuItem>)
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


