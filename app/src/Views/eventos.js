import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container,Select,MenuItem} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Eventos extends Component {



    constructor(props){
        super(props)
        this.state = {
            nombre:'',
            idJornada:'',
            idLocal:'',
            idVisitante:'',
            fecha:'',
            localRes:0,
            visitanteRes:0,
            idEvento:0,
            equipos:[],
            jornadas:[],
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'nombre', headerName: 'Nombre de Evento', width: 130 },
                { field: 'idJornada', headerName: 'ID Jornada', width: 130 },
                { field: 'idLocal', headerName: 'ID Local', width: 130 },
                { field: 'idVisitante', headerName: 'ID Visitante', width: 130 },
                { field: 'fecha', headerName: 'Fecha', width: 130 },
                { field: 'localRes', headerName: 'Puntos Local', width: 150 },
                { field: 'visitanteRes', headerName: 'Puntos Visitante', width: 160 },
            ]
        }
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createEvento/${this.state.nombre}/${this.state.idJornada}/${this.state.idLocal}/${this.state.idVisitante}/${this.state.fecha}`,
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

    async handleUpdate(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/setResultado/${this.state.idEvento}/${this.state.localRes}/${this.state.visitanteRes}`,
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
            await fetch(`http://localhost:8080/eventos`,
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
            await fetch(`http://localhost:8080/jornadas`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({jornadas:data})
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
                    this.setState({equipos:data})
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
                <Typography component="h1" variant="h5">Crear Evento</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Nombre"
                    autoFocus
                    onChange={(e)=> this.setState({nombre:e.target.value}) }
                />
                <Typography component="h1" variant="h6">Jornada</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    label="Jornada"  
                    onChange={(e)=> this.setState({idJornada:e.target.value})}
                >
                    {this.state.jornadas.map((item)=>{
                        return(
                            <MenuItem value={item.id}>{item.nombre}</MenuItem>
                        )
                    })}
                </Select>
                <Typography component="h1" variant="h6">Local</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    label="Local"  
                    onChange={(e)=> this.setState({idLocal:e.target.value})}
                >
                    {this.state.equipos.map((item)=>{
                        return(
                            <MenuItem value={item.id}>{item.nombre}</MenuItem>
                        )
                    })}
                </Select>
                <Typography component="h1" variant="h6">Visitante</Typography>
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    label="Visitante"  
                    onChange={(e)=> this.setState({idVisitante:e.target.value})}
                >
                    {this.state.equipos.map((item)=>{
                        return(
                            <MenuItem value={item.id}>{item.nombre}</MenuItem>
                        )
                    })}
                </Select>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="date"
                    label="Fecha"
                    onChange={(e)=> this.setState({fecha:e.target.value.replace('/','.')}) }
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
                <DataGrid getRowId={(row) => row.id} rows={this.state.rows} columns={this.state.columns} pageSize={20} checkboxSelection
                onSelectionModelChange={(selection=>this.setState({idEvento:selection.selectionModel[0]}))}/>   
                </div>
                
                <Container component="main" maxWidth="sm" style={{marginTop:20}}>
                    <Typography component="h1" variant="h5">Ingresar Resultado- Evento {this.state.idEvento}</Typography>
                    <form onSubmit={(e)=>this.handleUpdate(e)}>
                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="number"
                    label="Local Resultado"
                    onChange={(e)=> this.setState({localRes:e.target.value.replace('/','.')}) }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        label="Visita Resultado"
                        onChange={(e)=> this.setState({visitanteRes:e.target.value.replace('/','.')}) }
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
                

            </React.Fragment>
        )
    }
}


