import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Estratégias', path: '/estrategias' },
];

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('neofi_auth');
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar>
        <img src="/img/logo.png" alt="Logo NEOFI" style={{ height: 38, marginRight: 24 }} />
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          {navItems.map(item => (
            <Button
              key={item.path}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              variant={location.pathname === item.path ? 'contained' : 'text'}
              onClick={() => navigate(item.path)}
              sx={{ fontWeight: location.pathname === item.path ? 'bold' : 'normal' }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Button color="error" variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>Sair</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar; 