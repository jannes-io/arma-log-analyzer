import React, { useEffect, useState } from 'react';
import { IServerLoadData } from '../../types';
import { useLogFile } from '../../Hooks/LogFileContext';
import { Alert, Box, Button, Grid, Link, Slider, Typography } from '@mui/material';
import {
  BandwidthChart,
  ChartContainer,
  MessagesChart,
  MemoryChart,
  PlayerCountChart,
  ServerFpsChart,
} from './Components/Charts';

const PerformanceAnalyzer: React.FC = () => {
  const [fileData, setFileData] = useState<IServerLoadData[] | undefined>(undefined);
  const [activeFileData, setActiveFileData] = useState<IServerLoadData[] | undefined>(undefined);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [error, setError] = useState<React.ReactNode>();
  const [warning, setWarning] = useState<React.ReactNode>();

  const { logs, setIssues } = useLogFile();

  const analyzePerformance = (parsedData: IServerLoadData[]) => {
    const sustainedLowFPS = parsedData.filter(({ fps }) => fps <= 20).length;
    if (sustainedLowFPS / parsedData.length > 0.1) {
      setWarning(<>
        Sustained low Server FPS. Keep Server FPS equal or above 20 to prevent discarded message queues. <Link
          href="https://forums.bohemia.net/forums/topic/209091-server-fps-recommendation/?do=findComment&comment=3222350"
          target="_blank"
        >
          Read more
        </Link>
      </>);
    }
  };

  useEffect(() => {
    if (logs === undefined) {
      return;
    }

    setWarning(undefined);
    setError(undefined);

    const parsedData = logs
      .filter((ln) => ln.includes('Server load'))
      .map((ln) => /^(\d+:\d+:\d+) Server load: FPS (\d+), memory used: (\d+) MB, out: (\d+) Kbps, in: (\d+) Kbps, NG:(\d+), G:(\d+), BE-NG:\d+, BE-G:\d+, Players: (\d+)/g.exec(ln))
      .filter((arr): arr is RegExpExecArray => arr !== null)
      .map((arr, i): IServerLoadData => ({
        order: i,
        time: arr[1],
        fps: parseInt(arr[2], 10),
        memory: parseInt(arr[3], 10),
        transferOut: parseInt(arr[4], 10),
        transferIn: parseInt(arr[5], 10),
        nonGuaranteed: parseInt(arr[6], 10),
        guaranteed: parseInt(arr[7], 10),
        players: parseInt(arr[8], 10),
      }));

    if (parsedData.length === 0) {
      setFileData(undefined);
      setActiveFileData(undefined);
      setError('Could not locate any "Server load" messages. Please run #monitords as server administrator after mission selection.');
      return;
    }

    setFileData(parsedData);

    const initialRange = [0, Math.min(parsedData.length, 500)];
    setRange(initialRange);
    setActiveFileData(parsedData.slice(initialRange[0], initialRange[1]));

    analyzePerformance(parsedData);
  }, [logs]);

  useEffect(() => {
    setIssues('performanceAnalyzer', {
      hasErrors: error !== undefined,
      hasWarnings: warning !== undefined,
    });
  }, [error, warning]);

  const handleChangeRange = () => {
    setActiveFileData(fileData?.slice(range[0], range[1]));
  };

  return <Grid container spacing={3}>
    {error && <Grid item xs={12}>
      <Alert severity="error">
        <Typography>{error}</Typography>
      </Alert>
    </Grid>}
    {warning && <Grid item xs={12}>
      <Alert severity="warning">
        <Typography>{warning}</Typography>
      </Alert>
    </Grid>}
    {fileData && <Grid item xs={12}>
      <Slider
        disableSwap
        min={0}
        max={fileData.length}
        valueLabelDisplay="off"
        value={range}
        onChange={(_, newVal) => setRange(newVal as number[])}
      />
      <Box display="flex" justifyContent="space-between">
        <Typography>From: {fileData[range[0]].time}</Typography>
        <Typography>To: {fileData[range[1] - 1].time}</Typography>
      </Box>
      <Button variant="outlined" onClick={handleChangeRange}>Apply Range</Button>
    </Grid>}
    {activeFileData && <>
      <ChartContainer title="Player Count">
        <PlayerCountChart data={activeFileData} />
      </ChartContainer>
      <ChartContainer title="Server FPS">
        <ServerFpsChart data={activeFileData} />
      </ChartContainer>
      <ChartContainer title="Memory (MB)">
        <MemoryChart data={activeFileData} />
      </ChartContainer>
      <ChartContainer title="Bandwidth (Kbps)">
        <BandwidthChart data={activeFileData} />
      </ChartContainer>
      <ChartContainer title="Messages">
        <MessagesChart data={activeFileData} />
      </ChartContainer>
    </>}
  </Grid>;
};

export default PerformanceAnalyzer;
