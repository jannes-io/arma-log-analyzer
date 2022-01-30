import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { BrightnessHigh, BrightnessLow, GitHub } from '@mui/icons-material';
import AnalyzerScreen from './AnalyzerScreen';

const App: React.FC = () => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setDark] = useState(prefersDarkMode);

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#d18f21',
        contrastText: '#fff',
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
        <Tooltip title="Toggle Dark Mode">
          <IconButton onClick={() => setDark(!isDark)}>
            {isDark ? <BrightnessHigh /> : <BrightnessLow />}
          </IconButton>
        </Tooltip>
        <Tooltip title="GitHub Repository">
          <IconButton
            href="https://github.com/jannes-io/arma-log-analyzer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
    <Container maxWidth="xl">
      <Box sx={{ marginTop: 12, marginBottom: 3, flexGrow: 1 }}>
        <AnalyzerScreen />
      </Box>
    </Container>
  </ThemeProvider>;
};

export default App;
