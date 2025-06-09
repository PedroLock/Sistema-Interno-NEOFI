import React from 'react';
import Topbar from '../components/Topbar';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Estrategias() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('neofi_auth');
    navigate('/');
  };
  return (
    <Box>
      <Topbar />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {/* <Button variant="contained" color="error" onClick={handleLogout}>Sair</Button> */}
        </Box>
        <Typography variant="h4" color="primary" gutterBottom>Estratégias Possíveis</Typography>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">Renda Fixa Alavancada</Typography>
          <Typography>Desenvolvemos uma estratégia que une a solidez do mercado tradicional ao potencial do DeFi, com dívidas hiper colateralizadas e operações personalizadas...</Typography>
        </Paper>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">Crédito com Hold em Bitcoin ou Ethereum</Typography>
          <Typography>Permite que holders de BTC ou ETH obtenham liquidez sem vender os seus ativos, usando-os como garantia para empréstimos com taxas baixas...</Typography>
        </Paper>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">Emissão de Dívida para Consumo</Typography>
          <Typography>Na NeoFi, crédito não significa abrir mão do que é seu — significa fazer seus ativos trabalharem a seu favor...</Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Emissão de Dívida para Investimento</Typography>
          <Typography>O valor emitido não fica parado — ele é estrategicamente alocado com base no perfil de risco, prazo e objetivos de cada cliente...</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Estrategias; 