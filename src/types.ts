export interface IServerLoadData {
  order: number;
  time: string;
  fps: number;
  memory: number;
  transferOut: number;
  transferIn: number;
  nonGuaranteed: number;
  guaranteed: number;
  players: number;
}
