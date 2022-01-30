import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline, IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { BrightnessHigh, BrightnessLow } from '@mui/icons-material';
import AnalyzerScreen from './AnalyzerScreen';

const App: React.FC = () => {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setDark] = useState(prefersDarkMode);

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#d18f21',
        contrastText: '#fff'
      },
      background: {
        default: isDark ? '#3e3e3e' : '#f2f2f2',
      },
      mode: isDark ? 'dark' : 'light',
    },
  }), [isDark]);

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Arma Server Log Analyzer
        </Typography>
        <IconButton onClick={() => setDark(!isDark)}>
          {isDark ? <BrightnessHigh /> : <BrightnessLow />}
        </IconButton>
      </Toolbar>
    </AppBar>
    <Container maxWidth="xl">
      <Box sx={{ marginTop: 12, marginBottom: 3, flexGrow: 1 }}>
        <AnalyzerScreen />
      </Box>
    </Container>
  </ThemeProvider>
};

export default App;
