import logo from './logo.svg';
import './App.css';
import Login from './Views/login'
import LoginAdmin from './Views/loginAdmin'
import CreateAccount from './Views/createAccount'

import Dashboard from './Views/dashboard'
import Equipos from './Views/equipos'
import Deportes from './Views/deportes'
import Temporadas from './Views/temporada'
import Jornadas from './Views/Jornada';
import Menu from './Views/menu';
import Mensajes from './Views/mensajes';

import {BrowserRouter as Router,Switch,Route,withRouter} from "react-router-dom";
import MensajesAdmin from './Views/mensajesAdmin';
import Eventos from './Views/eventos';
import Recompensas from './Views/recompensa';
import Prediccion from './Views/prediccion';



function App() {
  return (
    <Router>
        <Switch>
          
          <Route path="/createAccount" component={CreateAccount}></Route>

          <Route path="/login" component={Login}></Route>

          <Route path="/loginAdmin" component={LoginAdmin}></Route>
          
          <Route path="/dashboard" component={Dashboard}></Route>

          <Route path="/menu" component={Menu}></Route>

          <Route path="/deportes" component={Deportes}></Route>

          <Route path="/equipos" component={Equipos}></Route>

          <Route path="/temporadas" component={Temporadas}></Route>

          <Route path="/jornadas" component={Jornadas}></Route>

          <Route path="/mensajes" component={Mensajes}></Route>

          <Route path="/eventos" component={Eventos}></Route>

          <Route path="/recompensas" component={Recompensas}></Route>

          <Route path="/predicciones" component={Prediccion}></Route>

          <Route path="/mensajesAdmin" component={MensajesAdmin}></Route>

          <Route path="/" component={Login}></Route>

        </Switch>
    </Router>
    
  );
}

export default App;
