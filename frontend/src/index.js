import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Router>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </Router>
);
