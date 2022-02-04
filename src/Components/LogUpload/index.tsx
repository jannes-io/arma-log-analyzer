import React from 'react';
import { Button, styled } from '@mui/material';

const Input = styled('input')({
  display: 'none',
});

interface ILogUploadProps {
  onChange: (data: string[]) => void;
}

const LogUpload: React.FC<ILogUploadProps> = ({ onChange }) => {
  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = ((e.target?.result || '') as string).replace(/\r\n/g, '\n').split('\n');
      onChange(data);
    };
    reader.readAsText(event.target.files[0]);
  };

  return <label htmlFor="logfile">
    <Input
      onChange={handleChangeFile}
      id="logfile"
      type="file"
    />
    <Button variant="contained" component="span">Load Server Log</Button>
  </label>;
};

export default LogUpload;
