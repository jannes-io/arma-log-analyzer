import React, { useState } from 'react';
import { Alert, Button, Grid, Slider, styled, Typography } from '@mui/material';
import { IServerLoadData } from '../../types';
import {
  BandwidthChart, ChartContainer, GuaranteedMsgChart, MemoryChart, NonGuaranteedMsgChart,
  PlayerCountChart,
  ServerFpsChart
} from './Components/Charts';

const Input = styled('input')({
  display: 'none',
});

const Pre = styled('pre')({
  display: 'inline',
  margin: 0,
})

const AnalyzerScreen: React.FC = () => {
  const [fileData, setFileData] = useState<IServerLoadData[] | undefined>(undefined);
  const [activeFileData, setActiveFileData] = useState<IServerLoadData[] | undefined>(undefined);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [error, setError] = useState<string>();

  const parseData = (data: string) => data
    .split('\n').filter((ln) => ln.includes('Server load'))
    .map((ln) => /^(\d+:\d+:\d+) Server load: FPS (\d+), memory used: (\d+) MB, out: (\d+) Kbps, in: (\d+) Kbps, NG:(\d+), G:(\d+), BE-NG:\d+, BE-G:\d+, Players: (\d+) \(.+\)$/g.exec(ln))
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
      players: parseInt(arr[8], 10)
    }));

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = parseData((e.target?.result || '') as string);
      if (data.length === 0) {
        setError('Could not locate any "Server load" messages.');
        return;
      }
      setError(undefined);
      setRange([0, data.length]);
      setFileData(data);
      setActiveFileData(data);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleChangeRange = () => {
    setActiveFileData(fileData?.slice(range[0], range[1]));
  };

  return <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography>This tool aims to assist in server performance debugging.</Typography>
      <Typography paddingBottom={1}>Instructions:</Typography>
      <Typography component="ul">
        <li>Enable server performance logging with the <Pre>#monitords {"<seconds>"}</Pre> command,</li>
        <li>Load the resulting server log file using the button below,</li>
        <li>Adjust the time scale to zoom in/out.</li>
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <label htmlFor="logfile">
        <Input
          onChange={handleChangeFile}
          id="logfile"
          type="file"
        />
        <Button variant="contained" component="span">Load Server Log</Button>
      </label>
    </Grid>
    {error && <Grid item xs={12}>
      <Alert variant="filled" severity="error">
        <Typography>{error}</Typography>
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
      <Typography>From: {fileData[range[0]].time}</Typography>
      <Typography>To: {fileData[range[1] - 1].time}</Typography>
      <Button onClick={handleChangeRange}>Apply Range</Button>
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
      <ChartContainer title="Guaranteed Messages">
        <GuaranteedMsgChart data={activeFileData} />
      </ChartContainer>
      <ChartContainer title="Non-Guaranteed Messages">
        <NonGuaranteedMsgChart data={activeFileData} />
      </ChartContainer>
    </>}
  </Grid>;
};

export default AnalyzerScreen;
