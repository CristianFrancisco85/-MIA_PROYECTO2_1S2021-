import React, { Component } from 'react'
import {AppBar,Toolbar,Typography,Button,TextField,Link,Container,Select,MenuItem} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import {BrowserRouter as Router,Link as LinkRouter} from "react-router-dom";


export default class Prediccion extends Component {



    constructor(props){
        super(props)
        this.state = {
            username:localStorage.getItem("username"),
            localRes:0,
            visitanteRes:0,
            idEvento:0,
            rows:[],
            columns:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'nombre', headerName: 'Nombre de Evento', width: 130 },
                { field: 'idJornada', headerName: 'ID Jornada', width: 130 },
                { field: 'idLocal', headerName: 'ID Local', width: 130 },
                { field: 'idVisitante', headerName: 'ID Visitante', width: 130 },
                { field: 'fecha', headerName: 'Fecha', width: 130 },
            ],
            predicciones:[],
            columns2:[
                { field: 'id', headerName: 'ID', width: 130 },
                { field: 'localRes', headerName: 'Local', width: 130 },
                { field: 'visitanteRes', headerName: 'Visitante', width: 130 },
                { field: 'idEvento', headerName: 'ID Evento', width: 130 },
            ]
        }
    }


    async handleSubmit(e){
        e.preventDefault()
        try{
            await fetch(`http://localhost:8080/createPrediccion/${this.state.username}/${this.state.localRes}/${this.state.visitanteRes}/${this.state.idEvento}`,
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
            await fetch(`http://localhost:8080/getPredicciones2/${this.state.username}`,
            {   
                method:'POST'
            })
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    this.setState({predicciones:data})
                }

            });
        }
        catch(error){
            console.error(error)
        }

        try{
            await fetch(`http://localhost:8080/eventos2`,
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
                    <Link component={LinkRouter} to="/mensajes" color="inherit"> Mensajes </Link>
                    <Link component={LinkRouter} to="/predicciones" color="inherit"> Predicciones </Link>
                    <Link component={LinkRouter} to="/" color="inherit"> Log-Out </Link>
                </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="sm" style={{marginTop:20}}>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                    <Typography component="h1" variant="h5">Crear Prediccion - Evento {this.state.idEvento}</Typography>
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

                <div style={{ height: 400, width: '100%' }}>
                <DataGrid getRowId={(row) => row.id} rows={this.state.rows} columns={this.state.columns} pageSize={20} checkboxSelection
                onSelectionModelChange={(selection=>this.setState({idEvento:selection.selectionModel[0]}))}/>   
                </div>

                <div style={{ height: 400, width: '100%' }}>
                <Typography component="h1" variant="h5">Tus Predicciones</Typography>
                <DataGrid getRowId={(row) => row.id} rows={this.state.predicciones} columns={this.state.columns2} pageSize={20} checkboxSelection/>   
                </div>
                
                

            </React.Fragment>
        )
    }
}


