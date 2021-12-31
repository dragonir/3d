import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { themeOptions } from './config/theme';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme(themeOptions);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
