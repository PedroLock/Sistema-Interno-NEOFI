import React from 'react';
import Topbar from '../components/Topbar';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('neofi_auth');
    navigate('/');
  };
  return (
    <Box>
      <Topbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>Dashboard Geral</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'secondary.light', borderLeft: '6px solid #17223b' }}>
              <Typography variant="h6">Operações Ativas</Typography>
              <Typography variant="h4" color="primary">0</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'secondary.light', borderLeft: '6px solid #17223b' }}>
              <Typography variant="h6">Volume de Crédito</Typography>
              <Typography variant="h4" color="primary">R$ 0,00</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'secondary.light', borderLeft: '6px solid #17223b' }}>
              <Typography variant="h6">Clientes Ativos</Typography>
              <Typography variant="h4" color="primary">0</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" color="primary">Alertas</Typography>
          <Typography>Nenhum alerta crítico no momento.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard; 