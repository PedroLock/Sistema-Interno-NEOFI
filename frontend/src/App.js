import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Operacoes from './pages/Operacoes';
import Relatorio from './pages/Relatorio';
import Estrategias from './pages/Estrategias';

const theme = createTheme({
  palette: {
    primary: { main: '#17223b' }, // azul escuro da logo
    secondary: { main: '#ffe066' }, // amarelo da logo
    background: { default: '#f5f6fa' },
  },
  typography: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
});

function isAuthenticated() {
  return localStorage.getItem('neofi_auth') === 'true';
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
          <Route path="/operacoes" element={<PrivateRoute><Operacoes /></PrivateRoute>} />
          <Route path="/operacoes/:clienteId" element={<PrivateRoute><Operacoes /></PrivateRoute>} />
          <Route path="/relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
          <Route path="/estrategias" element={<PrivateRoute><Estrategias /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 