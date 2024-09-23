import { createContext, useContext, ParentProps } from "solid-js";
import { Card, Player, TeamEnum } from "./game";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import { Map } from "immutable";

interface State {
  players: Player[];
  investigators: number;
  cultists: number;
  round: number;
  revealed: Map<Card, number>;
  active: number;
}

interface Context {
  active: () => number;
  addPlayer: (name: string) => void;
  cultists: () => number;
  initialise: VoidFunction;
  investigators: () => number;
  removeCardFrom: (idx: number) => Card;
  removePlayer: (idx: number) => void;
  reset: VoidFunction;
  round: () => number;
  setState: SetStoreFunction<State>;
  shuffle: VoidFunction;
  state: State;
}

const initialState: State = {
  players: [],
  investigators: 0,
  cultists: 0,
  round: 1,
  revealed: Map([
    [Card.Rune, 0],
    [Card.ElderSign, 0],
    [Card.Cthulhu, 0],
  ]),
  active: 0,
};

const defaultPlayer: Player = {
  name: "",
  team: null,
  cards: [],
};

const StateContext = createContext<Context>();

export function StateProvider(props: ParentProps) {
  const [state, setState] = createStore<State>(initialState);
  const { revealed } = state;

  function shuffle() {
    // Get all existing cards
    let cards: Card[] = [];
    setState("players", (players) => {
      players.forEach((p) => {
        cards = cards.concat(p.cards);
      });
      return players.map((p) => ({ ...p, cards: [] }));
    });

    let cthulhu = 1;
    let playerCount = state.players.length;
    let elderSigns = playerCount - revealed.get(Card.ElderSign);
    let runes = playerCount * 4 - 1 - revealed.get(Card.Rune);
    let totalCards = () => cthulhu + elderSigns + runes;

    setState("players", (players) => {
      return players.map((p) => {
        const cards = [];
        for (var i = 0; i < 5 - state.round; i++) {
          const r = Math.random() * totalCards();
          if (r > runes + elderSigns) {
            cthulhu -= 1;
            cards.push(Card.Cthulhu);
          } else if (r > runes) {
            elderSigns -= 1;
            cards.push(Card.ElderSign);
          } else {
            runes -= 1;
            cards.push(Card.Rune);
          }
        }
        return { ...p, cards };
      });
    });
  }

  const initialise = () => {
    // Set player teams and starting hand
    let investigatorCards = state.investigators;
    let cultistCards = state.cultists;
    let cthulhu = 1;
    let elderSigns = state.players.length;
    let runes = state.players.length * 4 - 1;
    let totalCards = () => cthulhu + elderSigns + runes;

    setState("players", (players) => {
      return players.map((p) => {
        const r = Math.random() * (investigatorCards + cultistCards);
        if (r > investigatorCards) {
          cultistCards -= 1;
          p.team = TeamEnum.Cultist;
        } else {
          investigatorCards -= 1;
          p.team = TeamEnum.Investigator;
        }

        const cards = [];
        for (var i = 0; i < 5; i++) {
          const r = Math.random() * totalCards();
          if (r > runes + elderSigns) {
            cthulhu -= 1;
            cards.push(Card.Cthulhu);
          } else if (r > runes) {
            elderSigns -= 1;
            cards.push(Card.ElderSign);
          } else {
            runes -= 1;
            cards.push(Card.Rune);
          }
        }
        return { ...p, cards };
      });
    });

    // Pick a random player to start
    setState("active", Math.floor(Math.random() * state.players.length));
  };

  const context: Context = {
    active() {
      return state.active;
    },
    addPlayer(name) {
      setState("players", state.players.length, { ...defaultPlayer, name });
    },
    cultists() {
      return state.cultists;
    },
    initialise,
    investigators() {
      return state.investigators;
    },
    removeCardFrom(idx) {
      const r = Math.floor(Math.random() * state.players[idx].cards.length);
      const card = state.players[idx].cards[r];
      setState(
        "players",
        idx,
        produce((player) => {
          player.cards = player.cards.filter((_, i) => r !== i);
        }),
      );
      setState("revealed", (revealed) => {
        return revealed.set(card, revealed.get(card) + 1);
      });
      return card;
    },
    removePlayer(idx) {
      setState("players", (players) =>
        players.filter((_p: Player, i: number) => idx !== i),
      );
    },
    reset() {
      setState(initialState);
    },
    round() {
      return state.round;
    },
    setState,
    shuffle,
    state,
  };

  return (
    <StateContext.Provider value={context}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState(): Context {
  return useContext(StateContext);
}
