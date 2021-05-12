package main
  
import (
    "fmt"
    "database/sql"
    _ "github.com/godror/godror"
    "github.com/gorilla/mux"
    "log"
	"net/http"
    "encoding/json"
)

//Types para la BDD
type Conteo struct {
	Total int `json:total`
}

type BoolResponse struct {
	Respuesta bool `json:"Res"`
}

type Deporte struct {
	ID int `json:"id"`
	Nombre string `json:"nombre"`
	Color  string `json:"color"`
}

type Equipo struct {
	ID int `json:"id"`
	Nombre string `json:"nombre"`
	IdDeporte  int `json:"IdDeporte"`
}

type Temporada struct {
	ID int `json:"id"`
	Año int `json:"año"`
	Estado  string `json:"estado"`
}

type Jornada struct {
	ID int `json:"id"`
	Nombre string `json:"nombre"`
	Estado  string `json:"estado"`
	Idtemporada int `json:"idtemporada"`
}

type Mensaje struct {
	ID int `json:"id"`
	Contenido string `json:"contenido"`
	Fecha  string `json:"fecha"`
}

type Evento struct {
	ID int `json:"id"`
	Nombre string `json:"nombre"`
	IdJornada int `json:"idJornada"`
	IdLocal int `json:"idLocal"`
	IdVisitante int `json:"idVisitante"`
	Fecha string `json:"fecha"`
	LocalRes int `json:"localRes"`
	VisitanteRes int `json:"visitanteRes"`
}

type Evento2 struct {
	ID int `json:"id"`
	Nombre string `json:"nombre"`
	IdJornada int `json:"idJornada"`
	IdLocal int `json:"idLocal"`
	IdVisitante int `json:"idVisitante"`
	Fecha string `json:"fecha"`
}

type Prediccion2 struct {
	ID int `json:"id"`
	LocalRes int `json:"localRes"`
	VisitanteRes int `json:"visitanteRes"`
	IdEvento int `json:"idEvento"`
}


type Cliente struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	Nombre     string `json:"nombre"`
	Apellido   string `json:"apellido"`
	Nacimiento string `json:"nacimiento"`
	Registro   string `json:"registro"`
	Correo     string `json:"correo"`
}

type Cliente2 struct {
	ID 	int `json:"id"`
	Username   string `json:"username"`
	Nombre     string `json:"nombre"`
	Apellido   string `json:"apellido"`
}

type Recompensa struct {
	ID 	int `json:"id"`
	IdCliente   int `json:"idCliente"`
	IdTemporada int `json:"idTemporada"`
	Total   int `json:"total"`
}



func main(){

    //Se crea Servidor
    s := NewServer()
    fmt.Println("Servidor Inicializado")
	log.Fatal(http.ListenAndServe(":8080", s.Router()))
}


// Servidor

type api struct {
	router http.Handler
}
type Server interface {
	Router() http.Handler
}

func NewServer() Server {
	a := &api{}
	r := mux.NewRouter()

    //MIS ENDPOINTS
    r.HandleFunc("/loginCliente/{username}/{password}", loginCliente)
	r.HandleFunc("/loginAdmin/{username}/{password}", loginAdmin)
    r.HandleFunc("/createCliente/{nombre}/{apellido}/{username}/{password}/{correo}/{nacimiento}", createCliente).Methods("POST")
	r.HandleFunc("/createDeporte/{nombre}/{color}", createDeporte).Methods("POST")
    r.HandleFunc("/clientes", getClientes)
	r.HandleFunc("/clientes2", getClientes2)
	r.HandleFunc("/deportes", getDeportes)
	r.HandleFunc("/createEquipo/{nombre}/{iddeporte}", createEquipo).Methods("POST")
	r.HandleFunc("/equipos", getEquipos)
	r.HandleFunc("/createTemporada/{año}/{estado}", createTemporada).Methods("POST")
	r.HandleFunc("/temporadas", getTemporadas)
	r.HandleFunc("/createJornada/{nombre}/{estado}/{idtemporada}", createJornada).Methods("POST")
	r.HandleFunc("/jornadas", getJornadas)
	r.HandleFunc("/sendMessage/{emisor}/{receptor}/{contenido}", sendMessage).Methods("POST")
	r.HandleFunc("/getMensajes/{receptor}", getMessage)
	r.HandleFunc("/sendMessageId/{emisor}/{idMensaje}/{contenido}", sendMessageId).Methods("POST")
	r.HandleFunc("/createEvento/{nombre}/{idJornada}/{idLocal}/{idVisitante}/{fecha}", createEvento).Methods("POST")
	r.HandleFunc("/eventos", getEventos)
	r.HandleFunc("/eventos2", getEventos2)
	r.HandleFunc("/setResultado/{idEvento}/{localRes}/{visitanteRes}", setResultado).Methods("POST")
	r.HandleFunc("/createRecompensa/{idCliente}/{total}/{idTemporada}", createRecompensa).Methods("POST")
	r.HandleFunc("/recompensas", getRecompensa)
	r.HandleFunc("/createPrediccion/{username}/{localRes}/{visitanteRes}/{idEvento}", createPrediccion).Methods("POST")
	r.HandleFunc("/getPredicciones2/{username}", getPredicciones2)

	a.router = r
	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

func loginCliente(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
    fmt.Println("Create Cliente")
	vars := mux.Vars(r)
	username := vars["username"]
	password := vars["password"]
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("SELECT COUNT(*) as Total FROM Cliente WHERE username ='" + username + "' AND passwd='" + password + "'")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
	var total Conteo
	for res.Next() {
		err = res.Scan(&total.Total)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(total.Total)
}

func loginAdmin(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	password := vars["password"]
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("SELECT COUNT(*) as Total FROM Cliente WHERE username ='admin' AND passwd='" + password + "'")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
	var total Conteo
	for res.Next() {
		err = res.Scan(&total.Total)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(total.Total)
}

func createCliente(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
    fmt.Println("Create Cliente")
	vars := mux.Vars(r)
	username := vars["username"]
	password := vars["password"]
	nombre := vars["nombre"]
	apellido := vars["apellido"]
	nacimiento := vars["nacimiento"]
	correo := vars["correo"]
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Cliente(Username, Passwd, Nombre, Apellido, FechaNacimiento, FechaRegistro,Email) VALUES ('" + username + "', '" + password + "', '" + nombre + "', '" + apellido + "',(SELECT sysdate FROM dual) , TO_DATE( '" + nacimiento + "' , 'YYYY MM DD  ' ), '" + correo + "')")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    var temporal BoolResponse
    temporal.Respuesta = true
	json.NewEncoder(w).Encode(temporal)
}

func getClientes(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
    fmt.Println("Get Clientes")
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT Username, Passwd, Nombre, Apellido, FechaNacimiento, FechaRegistro,Email FROM Cliente")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Cliente{}
    for res.Next() {
		var temporal Cliente
		err = res.Scan(&temporal.Username, &temporal.Password, &temporal.Nombre, &temporal.Apellido, &temporal.Nacimiento, &temporal.Registro, &temporal.Correo)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, temporal)
	}
    json.NewEncoder(w).Encode(contenido)
    
}

func createDeporte(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	nombre := vars["nombre"]
	color := vars["color"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Deporte(nombre, color) VALUES ('" + nombre + "', '" + color + "')")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getDeportes(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT iddeporte,nombre, color FROM Deporte")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Deporte{}
	for res.Next() {
		var nombre Deporte
		err = res.Scan(&nombre.ID,&nombre.Nombre, &nombre.Color)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
    
}

func createEquipo(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	nombre := vars["nombre"]
	iddeporte := vars["iddeporte"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Equipo(nombre, iddeporte) VALUES ('" + nombre + "', '" + iddeporte + "')")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getEquipos(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idequipo,nombre, iddeporte FROM Equipo")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Equipo{}
	for res.Next() {
		var nombre Equipo
		err = res.Scan(&nombre.ID,&nombre.Nombre, &nombre.IdDeporte)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
    
}

func createTemporada(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	año := vars["año"]
	estado := vars["estado"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Temporada(año, estado) VALUES ('" + año + "', '" + estado + "')")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getTemporadas(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idtemporada,año, estado FROM Temporada")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Temporada{}
	for res.Next() {
		var nombre Temporada
		err = res.Scan(&nombre.ID,&nombre.Año, &nombre.Estado)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
    
}

func createJornada(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	nombre := vars["nombre"]
	estado := vars["estado"]
	idtemporada := vars["idtemporada"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Jornada(nombre, estado,idtemporada) VALUES ('" + nombre + "', '" + estado + "',"+ idtemporada + ")")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getJornadas(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idjornada,nombre, estado,idtemporada FROM Jornada")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Jornada{}
	for res.Next() {
		var nombre Jornada
		err = res.Scan(&nombre.ID,&nombre.Nombre, &nombre.Estado,&nombre.Idtemporada)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
    
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	emisor := vars["emisor"]
	receptor := vars["receptor"]
	contenido := vars["contenido"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Mensaje(idemisor,idreceptor,contenido,fecha) VALUES((SELECT idCliente FROM Cliente WHERE username='"+emisor+"'),(SELECT idCliente FROM Cliente WHERE username='"+receptor+"'),'"+contenido+"',(SELECT sysdate FROM dual) )")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getMessage(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	receptor := vars["receptor"]
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idmensaje,contenido,fecha FROM Mensaje WHERE idreceptor = (SELECT idCliente FROM Cliente WHERE username='"+receptor+"')")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Mensaje{}
	for res.Next() {
		var nombre Mensaje
		err = res.Scan(&nombre.ID,&nombre.Contenido, &nombre.Fecha)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
}

func sendMessageId(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	emisor := vars["emisor"]
	idMensaje := vars["idMensaje"]
	contenido := vars["contenido"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Mensaje(idemisor,idreceptor,contenido,fecha) VALUES((SELECT idCliente FROM Cliente WHERE username='"+emisor+"'),(SELECT idEmisor FROM Mensaje WHERE idMensaje='"+idMensaje+"'),'"+contenido+"',(SELECT sysdate FROM dual) )")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func createEvento(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	nombre := vars["nombre"]
	idJornada := vars["idJornada"]
	idLocal := vars["idLocal"]
	idVisitante := vars["idVisitante"]
	fecha := vars["fecha"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Evento(nombre, idjornada,idLocal,idVisitante,fecha,localRes,visitanteRes) VALUES ('" + nombre + "'," + idJornada + ","+ idLocal + ","+ idVisitante + ",TO_DATE( '" + fecha + "' , 'YYYY MM DD  ' ),-1,-1)")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getEventos(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idevento,nombre, idjornada,idLocal,idVisitante,fecha,localRes,visitanteRes FROM Evento ")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Evento{}
	for res.Next() {
		var nombre Evento
		err = res.Scan(&nombre.ID,&nombre.Nombre,&nombre.IdJornada,&nombre.IdLocal,&nombre.IdVisitante,&nombre.Fecha,&nombre.LocalRes,&nombre.VisitanteRes)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
}

func setResultado(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	idEvento := vars["idEvento"]
	localRes := vars["localRes"]
	visitanteRes := vars["visitanteRes"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("UPDATE Evento SET localRes="+localRes+",visitanteRes ="+visitanteRes+"WHERE idEvento ="+idEvento)
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getClientes2(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idCliente,Username, Nombre, Apellido FROM Cliente WHERE username!='admin'")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Cliente2{}
    for res.Next() {
		var temporal Cliente2
		err = res.Scan(&temporal.ID,&temporal.Username,&temporal.Nombre, &temporal.Apellido)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, temporal)
	}
    json.NewEncoder(w).Encode(contenido)
    
}

func createRecompensa(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	idCliente := vars["idCliente"]
	total := vars["total"]
	idTemporada := vars["idTemporada"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Recompensa(idCliente,total,idTemporada) VALUES (" + idCliente + "," + total + ","+ idTemporada+")")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getRecompensa(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idRecompensa,idCliente, idTemporada, total FROM Recompensa")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Recompensa{}
    for res.Next() {
		var temporal Recompensa
		err = res.Scan(&temporal.ID,&temporal.IdCliente,&temporal.IdTemporada, &temporal.Total)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, temporal)
	}
    json.NewEncoder(w).Encode(contenido)
    
}

func getEventos2(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idevento,nombre, idjornada,idLocal,idVisitante,fecha FROM Evento ")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Evento2{}
	for res.Next() {
		var nombre Evento2
		err = res.Scan(&nombre.ID,&nombre.Nombre,&nombre.IdJornada,&nombre.IdLocal,&nombre.IdVisitante,&nombre.Fecha)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
}

func createPrediccion(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	vars := mux.Vars(r)
	username := vars["username"]
	localRes := vars["localRes"]
	visitanteRes := vars["visitanteRes"]
	idEvento := vars["idEvento"]
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res, err := db.Query("INSERT INTO Prediccion(idCliente,localRes,visitanteRes,idEvento) VALUES ((SELECT idCliente FROM Cliente WHERE username='"+username+"')," + localRes + ","+ visitanteRes + ","+ idEvento+")")
	if err != nil {
		res = res
		json.NewEncoder(w).Encode(err.Error())
	} else {
		var temporal BoolResponse
		temporal.Respuesta = true
		json.NewEncoder(w).Encode(temporal)
	}
}

func getPredicciones2(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("godror", "system/passwd@localhost:1521/xe")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()


	vars := mux.Vars(r)
	username := vars["username"]
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res, err := db.Query("SELECT idPrediccion,localRes,visitanteRes,idEvento FROM Prediccion WHERE idCliente=(SELECT idCliente FROM Cliente WHERE username='"+username+"')")
	if err != nil {
		log.Println(res)
		json.NewEncoder(w).Encode(err.Error())
	}
    contenido := []Prediccion2{}
	for res.Next() {
		var nombre Prediccion2
		err = res.Scan(&nombre.ID,&nombre.LocalRes,&nombre.VisitanteRes,&nombre.IdEvento)
		if err != nil {
			panic(err.Error())
		}
		contenido = append(contenido, nombre)
	}
	json.NewEncoder(w).Encode(contenido)
}