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
  // Makes it easier to select player in round
  idx: number;
  team: Accessor<Team>;
  setTeam: Setter<Team>;
  Cards: {
    get: Accessor<Card[]>;
    add: (c: Card) => void;
    pop: (i: number) => Card;
    clear: () => void;
  };
}

export function newPlayer(name: string): Player {
  const [team, setTeam] = createSignal<Team>(null);
  const [cards, setCards] = createSignal([]);
  const Cards = {
    get: cards,
    add(c: Card) {
      setCards([...cards(), c]);
    },
    pop(i: number): Card {
      const card = cards()[i];
      setCards(cards().filter((_e, ind: number) => i !== ind));
      return card;
    },
    clear() {
      setCards([]);
    },
  };
  return { name, team, setTeam, Cards };
}
