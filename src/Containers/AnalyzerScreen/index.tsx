import React, { useState } from 'react';
import { Alert, Box, Grid, Link, styled, Tab, Tabs, Typography } from '@mui/material';
import LogUpload from '../../Components/LogUpload';
import {
  defaultLogContextState,
  IIssues,
  ILogFileContext,
  LogFileContext,
} from '../../Hooks/LogFileContext';
import PerformanceAnalyzer from '../../Components/PerformanceAnalyzer';
import {
  CheckCircleOutline,
  ErrorOutline,
  WarningOutlined,
} from '@mui/icons-material';
import MissionAnalyzer from '../../Components/MissionAnalyzer';

const Pre = styled('pre')({
  display: 'inline',
  margin: 0,
});

interface IPreLoadedTabPanelProps {
  index: number;
  value: number | false;
}

const PreLoadedTabPanel: React.FC<IPreLoadedTabPanelProps> = ({ children, value, index }) => <Box
  sx={{ display: value === index ? 'initial' : 'none' }}
>
  {children}
</Box>;

const AnalyzerScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | false>(false);
  const [logFileState, setLogFileState] = useState({ ...defaultLogContextState });

  const setIssues = (key: keyof ILogFileContext, issues: IIssues) => {
    setLogFileState((clogFileState) => ({ ...clogFileState, [key]: issues }));
  };

  const handleOnFileChange = (logs: string[]) => {
    setLogFileState({
      ...defaultLogContextState,
      logs,
    });
  };

  const getTabLabel = (label: string, issues: IIssues) => {
    const getIcon = () => {
      if (issues.hasErrors) {
        return <ErrorOutline color="error" />;
      }

      if (issues.hasWarnings) {
        return <WarningOutlined color="warning" />;
      }

      return <CheckCircleOutline color="success" />;
    };
    const icon = getIcon();
    return <Box sx={{ display: 'flex', alignItems: 'bottom' }}>
      {icon}
      <Typography fontWeight="bold" paddingLeft={1}>{label}</Typography>
    </Box>;
  };

  return <LogFileContext.Provider value={{ ...logFileState, setIssues }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info">This tool is in active development. All things are subject to change.
          Have any ideas? Contact pvtHenk#8008 in the <Link
            href="https://discord.com/invite/arma"
            target="_blank"
            rel="noreferrer"
          >
            official Arma discord
          </Link>.
        </Alert>
        <Typography paddingTop={3}>This tool aims to assist in server performance
          debugging.</Typography>
        <Typography paddingBottom={1}>Instructions:</Typography>
        <Typography component="ul">
          <li>Enable server performance logging with
            the <Pre>#monitords {'<seconds>'}</Pre> command,
          </li>
          <li>Load the resulting server log file using the button below.</li>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <LogUpload onChange={handleOnFileChange} />
      </Grid>
      {logFileState.logs !== undefined && <>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={activeTab} onChange={(_, active) => setActiveTab(active)}>
              <Tab label={getTabLabel('Server Load', logFileState.performanceAnalyzer)} />
              <Tab label={getTabLabel('Mission File', logFileState.missionAnalyzer)} />
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PreLoadedTabPanel index={0} value={activeTab}>
            <PerformanceAnalyzer />
          </PreLoadedTabPanel>
          <PreLoadedTabPanel index={1} value={activeTab}>
            <MissionAnalyzer />
          </PreLoadedTabPanel>
        </Grid>
      </>}
    </Grid>
  </LogFileContext.Provider>;
};

export default AnalyzerScreen;
