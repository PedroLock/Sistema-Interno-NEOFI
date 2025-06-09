import React from 'react';
import Topbar from '../components/Topbar';
import { Box, Typography, Paper } from '@mui/material';

function Relatorio() {
  return (
    <Box>
      <Topbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>Relatório de Operação Imobiliária</Typography>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography>Conteúdo do relatório imobiliário aqui...</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Relatorio; 