import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'neofi' && pass === 'dívidainteligente') {
      setError('');
      localStorage.setItem('neofi_auth', 'true');
      navigate('/dashboard');
    } else {
      setError('Usuário ou senha incorretos!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <img src="/img/logo.png" alt="Logo NEOFI" style={{ height: 70, marginBottom: 20 }} />
        <Typography variant="h5" color="primary" gutterBottom>Acesse o sistema NEOFI</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Usuário" fullWidth margin="normal" value={user} onChange={e => setUser(e.target.value)} autoFocus />
          <TextField
            label="Senha"
            type={showPass ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={pass}
            onChange={e => setPass(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(v => !v)} edge="end" aria-label="Mostrar senha">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">Entrar</Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>© 2025 neo.fi finance</Typography>
      </Paper>
    </Box>
  );
}

export default Login; 