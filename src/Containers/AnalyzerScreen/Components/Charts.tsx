import React from 'react';
import { IServerLoadData } from '../../../types';
import { Grid, Paper, Typography, useTheme } from '@mui/material';
import {
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart, CartesianGrid,
} from 'recharts';

interface IChartContainerProps {
  title: string;
}

export const ChartContainer: React.FC<IChartContainerProps> = ({ title, children }) => (
  <Grid item xs={12}>
    <Paper sx={{ width: '100%', padding: 1, display: 'flex', flexDirection: 'row' }}>
      <Typography
        sx={{
          textAlign: 'center',
          paddingBottom: 2,
          writingMode: 'vertical-lr',
          textOrientation: 'mixed',
        }}
        variant="subtitle1">
        {title}
      </Typography>
      <Typography sx={{ width: '100%', height: '200px' }} component="div">
        {children}
      </Typography>
    </Paper>
  </Grid>
);

const useTooltipContentStyle = () => {
  const { palette, spacing } = useTheme();

  return {
    backgroundColor: palette.background.default,
    border: 'none',
    borderRadius: spacing(0.5),
  };
};

interface IChartProps {
  data: IServerLoadData[];
}

const chartPropsEqual = ({ data: prevData }: IChartProps, { data: nextData }: IChartProps) => (
  prevData.length === nextData.length
  && prevData[0].time === nextData[0].time
  && prevData[prevData.length - 1].time === nextData[nextData.length - 1].time
);

export const PlayerCountChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, players }) => ({ label: time, value: players }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);

export const ServerFpsChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, fps }) => ({ label: time, value: fps }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <ReferenceLine y={20} stroke="red" />
      <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);

export const MemoryChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, memory }) => ({ label: time, value: memory }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);

export const BandwidthChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, transferIn, transferOut }) => ({
    label: time,
    transferIn,
    transferOut,
  }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <Line type="monotone" dataKey="transferIn" stroke={palette.secondary.main} dot={false} />
      <Line type="monotone" dataKey="transferOut" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);

export const GuaranteedMsgChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, guaranteed }) => ({ label: time, value: guaranteed }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);

export const NonGuaranteedMsgChart: React.FC<IChartProps> = React.memo(({ data }) => {
  const { palette } = useTheme();
  const tooltipContentStyle = useTooltipContentStyle();

  const chartData = data.map(({ time, nonGuaranteed }) => ({ label: time, value: nonGuaranteed }));

  return <ResponsiveContainer>
    <LineChart data={chartData} syncId="perf">
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip contentStyle={tooltipContentStyle} />
      <CartesianGrid strokeDasharray="3 3" stroke={palette.background.default} />
      <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
    </LineChart>
  </ResponsiveContainer>;
}, chartPropsEqual);
