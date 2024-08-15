import { Setter } from "solid-js";
import Lobby from "./Lobby";
import Reveal from "./Reveal";
import Round from "./Round";
import End from "./End";

export enum Stage {
  End,
  Lobby,
  Reveal,
  Round,
}

export const stageMap = new Map([
  [Stage.End, End],
  [Stage.Lobby, Lobby],
  [Stage.Reveal, Reveal],
  [Stage.Round, Round],
]);

export interface StageProps {
  setStage: Setter<Stage>;
}
