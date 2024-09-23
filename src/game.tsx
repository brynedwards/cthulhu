import { Accessor, Setter, createSignal } from "solid-js";

export enum TeamEnum {
  Investigator = "Investigator",
  Cultist = "Cultist",
}

type Team = TeamEnum | null;

export enum Card {
  Rune = "Rune",
  ElderSign = "Elder Sign",
  Cthulhu = "Cthulhu",
}

export interface Player {
  name: string;
  team: Team;
  cards: Card[];
}
