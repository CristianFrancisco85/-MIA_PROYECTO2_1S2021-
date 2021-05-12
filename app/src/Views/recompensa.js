import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container,Select,MenuItem} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Recompensas extends Component {



    constructor(props){
        super(props)
        this.state = {
            idUser:0,
            total:'',
            idTemporada:'',
            temporadas : [],
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'username', headerName: 'Username', width: 130 },
                { field: 'nombre', headerName: 'Nombre', width: 130 },
                { field: 'apellido', headerName: 'Apellido', width: 130 },
            ],
            rows2:[],
            columns2:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'idCliente', headerName: 'Username', width: 130 },
                { field: 'idTemporada', headerName: 'ID Temporada', width: 130 },
                { field: 'total', headerName: 'Total', width: 130 },
            ]
        }
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createRecompensa/${this.state.idUser}/${this.state.total}/${this.state.idTemporada}`,
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
            await fetch(`http://localhost:8080/clientes2`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({rows:data})
                }
                else{
                }
            });
        }
        catch(error){
            console.error(error)
        }
        try{
            await fetch(`http://localhost:8080/recompensas`,
            {   
                method:'GET'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({rows2:data})
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
                <Typography component="h1" variant="h5">Crear Recompensa- User {this.state.idUser}</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Total"
                    autoFocus
                    onChange={(e)=> this.setState({total:e.target.value}) }
                />
                <Select 
                    variant="outlined"
                    autoWidth={true}
                    required
                    label="Temporada"  
                    onChange={(e)=> this.setState({idTemporada:e.target.value})}
                >
                    {this.state.temporadas.map((item)=>{
                        return(
                            <MenuItem value={item.id}>{item.año}</MenuItem>
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
                <DataGrid getRowId={(row) => row.id} rows={this.state.rows} columns={this.state.columns} pageSize={20} checkboxSelection
                onSelectionModelChange={(selection=>this.setState({idUser:selection.selectionModel[0]}))}/>   
                </div>

                <div style={{ height: 400, width: '100%' }}>
                <DataGrid getRowId={(row) => row.id} rows={this.state.rows2} columns={this.state.columns2} pageSize={20} checkboxSelection/>   
                </div>
                

            </React.Fragment>
        )
    }
}


