import { Map } from "immutable";
import {
  createSignal,
  createContext,
  useContext,
  ParentProps,
  Setter,
  Accessor,
} from "solid-js";
import { Card, Player, TeamEnum, newPlayer } from "./game";

interface State {
  Players: {
    get: Accessor<Player[]>;
    count: () => number;
    add: (name: string) => void;
    remove: (index: number) => void;
    active: () => Player | null;
    setActive: Setter<number>;
  };
  investigatorCount: Accessor<number>;
  setInvestigatorCount: Setter<number>;
  cultistCount: Accessor<number>;
  setCultistCount: Setter<number>;
  initialise: () => void;
  reset: () => void;
  Round: {
    current: Accessor<number>;
    next: () => void;
  };
  Revealed: {
    cthulhu: Accessor<number>;
    runes: Accessor<number>;
    elderSigns: Accessor<number>;
    add: (c: Card) => void;
  };
}

const StateContext = createContext<State>();

export function StateProvider(props: ParentProps<State>) {
  const [players, setPlayers] = createSignal([]);
  const playerCount = () => players().length;
  const [investigatorCount, setInvestigatorCount] = createSignal(0);
  const [cultistCount, setCultistCount] = createSignal(0);
  const [activePlayerIndex, setActivePlayerIndex] = createSignal(null);
  const [round, setRound] = createSignal(1);
  const [playedCards, setPlayedCards] = createSignal(
    Map({ [Card.Rune]: 0, [Card.ElderSign]: 0, [Card.Cthulhu]: 0 }),
  );

  function shuffle() {
    // Get all existing cards
    let cards: Card[] = [];
    players().forEach((p) => {
      cards = cards.concat(p.Cards.get());
      p.Cards.clear();
    });

    let cthulhu = 1;
    let elderSigns = playerCount() - playedCards().get(Card.ElderSign);
    let runes = playerCount() * 4 - 1 - playedCards().get(Card.Rune);
    let totalCards = () => cthulhu + elderSigns + runes;

    players().forEach((p) => {
      for (var i = 0; i < 5 - round(); i++) {
        const r = Math.random() * totalCards();
        if (r > runes + elderSigns) {
          cthulhu -= 1;
          p.Cards.add(Card.Cthulhu);
        } else if (r > runes) {
          elderSigns -= 1;
          p.Cards.add(Card.ElderSign);
        } else {
          runes -= 1;
          p.Cards.add(Card.Rune);
        }
      }
    });
  }

  const initialise = () => {
    // Set player teams and starting hand
    let investigatorCards = investigatorCount();
    let cultistCards = cultistCount();
    let cthulhu = 1;
    let elderSigns = playerCount();
    let runes = playerCount() * 4 - 1;
    let totalCards = () => cthulhu + elderSigns + runes;
    players().forEach((p) => {
      const r = Math.random() * (investigatorCards + cultistCards);
      if (r > investigatorCards) {
        cultistCards -= 1;
        p.setTeam(TeamEnum.Cultist);
      } else {
        investigatorCards -= 1;
        p.setTeam(TeamEnum.Investigator);
      }

      for (var i = 0; i < 5; i++) {
        const r = Math.random() * totalCards();
        if (r > runes + elderSigns) {
          cthulhu -= 1;
          p.Cards.add(Card.Cthulhu);
        } else if (r > runes) {
          elderSigns -= 1;
          p.Cards.add(Card.ElderSign);
        } else {
          runes -= 1;
          p.Cards.add(Card.Rune);
        }
      }

      // Pick a random player to start
      setActivePlayerIndex(Math.floor(Math.random() * playerCount()));
    });
  };

  const reset = () => {
    players().forEach((p: Player) => {
      p.setTeam(null);
      p.Cards.clear();
    });
    setActivePlayerIndex(null);
    setRound(1);
    setPlayedCards(Map({ [Card.Rune]: 0, [Card.ElderSign]: 0, [Card.Cthulhu]: 0 }));
  };

  const state = {
    Players: {
      get: players,
      count() {
        return players().length;
      },
      add(name: string) {
        setPlayers([...players(), newPlayer(name)]);
      },
      remove(index: number) {
        setPlayers(players().filter((_e, i) => index !== i));
      },
      active() {
        if (activePlayerIndex() === null) return null;
        return players()[activePlayerIndex()];
      },
      setActive: setActivePlayerIndex,
    },
    investigatorCount,
    setInvestigatorCount,
    cultistCount,
    setCultistCount,
    initialise,
    reset,
    Round: {
      current: round,
      next() {
        shuffle();
        setRound(round() + 1);
      },
    },
    Revealed: {
      cthulhu() {
        return playedCards().get(Card.Cthulhu);
      },
      runes() {
        return playedCards().get(Card.Rune);
      },
      elderSigns() {
        return playedCards().get(Card.ElderSign);
      },
      add(c: Card) {
        setPlayedCards(playedCards().update(c, (value) => value + 1));
      },
    },
  };

  return (
    <StateContext.Provider value={state}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState(): State {
  return useContext(StateContext);
}
