import React, { useEffect, useState } from 'react';
import { useLogFile } from '../../Hooks/LogFileContext';
import { Alert, Grid, Typography } from '@mui/material';

const MissionAnalyzer: React.FC = () => {
  const [missingAddons, setMissingAddons] = useState<string[]>([]);
  const [missionData, setMissionData] = useState({
    missionFile: '',
    missionWorld: '',
    missionDir: '',
  });
  const { logs, setIssues } = useLogFile();

  const findMissionData = () => {
    if (logs === undefined) {
      return;
    }

    const missionFile = logs.find((ln) => ln.includes(' Mission file:')) || '';
    const missionWorld = logs.find((ln) => ln.includes(' Mission world:')) || '';
    const missionDir = logs.find((ln) => ln.includes(' Mission directory:')) || '';

    setMissionData({
      missionFile,
      missionWorld,
      missionDir,
    });
  };

  const findMissingAddons = () => {
    if (logs === undefined) {
      return;
    }

    const missingAddonsStart = logs.findIndex((ln) => ln.includes('Missing addons detected'));
    if (missingAddonsStart === undefined) {
      return;
    }

    const missingAddonsL = [];
    for (let i = missingAddonsStart; i++; i < logs?.length) {
      const matches = /\d+:\d+:\d+   (.+)/.exec(logs[i]);
      if (matches === null) {
        break;
      }
      missingAddonsL.push(matches[1]);
    }

    setMissingAddons(missingAddonsL);
  };

  useEffect(() => {
    if (logs === undefined) {
      return;
    }

    findMissionData();
    findMissingAddons();
  }, [logs]);

  useEffect(() => {
    setIssues('missionAnalyzer', {
      hasErrors: missingAddons.length !== 0,
    });
  }, [missingAddons]);

  return <Grid container spacing={3}>
    {missingAddons.length !== 0 && <Grid item xs={12}>
      <Alert severity="error">
        <Typography>The mission you are trying to run depends on addons which are not present on the
          server! Ensure all required mods are installed & loaded on the server.</Typography>
        <Typography>Missing addons:</Typography>
        <ul>
          {missingAddons.map((addon) => <li key={addon}>{addon}</li>)}
        </ul>
      </Alert>
    </Grid>}
    <Grid item xs={12}>
      <Typography>{missionData.missionFile}</Typography>
      <Typography>{missionData.missionWorld}</Typography>
      <Typography>{missionData.missionDir}</Typography>
    </Grid>
  </Grid>;
};

export default MissionAnalyzer;
