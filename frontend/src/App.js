import './App.css';
import React from 'react';
import { Router, Switch, Route,Routes, Link } from 'react-router-dom';

//import pagina bienvenida
import {Welcome} from './pages/welcome';
import {Inputs} from './pages/inputs';
import {Outputs} from './pages/outputs'


function App() {
  return (
      <Routes>
        {/*<Route path='*' element={<NotFound/>}></Route>*/}
        {<Route path='/' element={<Welcome/>}></Route>}
        {<Route path='/inputs' element={<Inputs/>}></Route>}
        {<Route path='/outputs/:semana' element={<Outputs/>}></Route>}
      </Routes>
  );
}

export default App;
