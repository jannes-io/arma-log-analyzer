import { createContext, useContext } from 'react';

export interface IIssues {
  hasWarnings?: boolean;
  hasErrors?: boolean;
}

export interface ILogFileState {
  logs: string[] | undefined;
  performanceAnalyzer: IIssues;
  missionAnalyzer: IIssues;
}

export interface ILogFileContext extends ILogFileState{
  setIssues: (key: keyof ILogFileContext, issues: IIssues) => void;
}

export const defaultLogContextState: ILogFileState = {
  logs: undefined,
  performanceAnalyzer: {},
  missionAnalyzer: {},
};

export const LogFileContext = createContext<ILogFileContext>({
  ...defaultLogContextState,
  setIssues: () => {},
});

export const useLogFile = () => useContext(LogFileContext);

