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
type Deporte struct {
    ID   int    `json:"id"`
    Imagen []byte `json:"image"`
    Color string `json:"color"`
    Nombre string `json:"name"`
}

func main(){

    //Se crea Servidor
    s := NewServer()
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
    r.HandleFunc("/myEndpoint", a.fetchDeportes).Methods(http.MethodGet)

	a.router = r
	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

func (a *api) fetchDeportes(w http.ResponseWriter, r *http.Request) {

        
    db, err := sql.Open("godror", "sys/passwd@localhost:1521/xe as SYSDBA")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer db.Close()

    rows,err := db.Query("SELECT * FROM deporte")
    if err != nil {
        fmt.Println("Error running query")
        fmt.Println(err)
        return
    }
    defer rows.Close()
  
    var myDeporte Deporte
    for rows.Next() {
        err= rows.Scan(&myDeporte.ID,&myDeporte.Imagen,&myDeporte.Color,&myDeporte.Nombre)
        if err != nil {
            fmt.Println(err)
        }
    }

    json.NewEncoder(w).Encode(myDeporte)
}






