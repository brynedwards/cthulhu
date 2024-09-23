import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { useState } from "../state";
import { Card, Player } from "../game";
import { Stage, StageProps } from ".";

const verbs = ["found", "discovered", "unearthed"];
const Round: Component = (props: StageProps) => {
  const { active, removeCardFrom, setState, shuffle, state } = useState();
  const { players, round } = state;
  const [msg, setMsg] = createSignal(["", ""]);
  const [turn, setTurn] = createSignal(1);
  const [revealing, setRevealing] = createSignal(false);
  let lastRevealed = null;
  let chosenPlayer = null;
  const keyDownEvent = useKeyDownEvent();

  function choose(p: Player, i: number) {
    // Choose a random card from player p
    const card = removeCardFrom(i);
    const a = card === Card.Cthulhu ? "" : "a";
    const n = card === Card.ElderSign ? "n" : "";
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    setMsg([p.name, `${verb} ${a}${n} ${card}!`]);
    setRevealing(true);
    lastRevealed = card;
    chosenPlayer = i;
  }

  function nextMove() {
    if (
      lastRevealed === Card.Cthulhu ||
      state.revealed.get(Card.ElderSign) === players.length
    ) {
      props.setStage(Stage.End);
      return;
    }
    // Set player p as active player
    setState("active", chosenPlayer);
    setTurn(turn() + 1);
    if (turn() === players.length + 1) {
      setState("round", (n) => n + 1);
      shuffle();
      if (round > 4) {
        // Cultists win
        props.setStage(Stage.End);
      } else {
        props.setStage(Stage.Reveal);
      }
    }
    setRevealing(false);
  }

  createEffect(() => {
    if (!revealing()) return;
    const e = keyDownEvent();
    if (e !== null && e.key === "Enter") {
      nextMove();
    }
  });

  return (
    <>
      <h1>Round {round}</h1>
      <h2>
        Turn {turn()} of {players.length}
      </h2>
      <strong>Revealed cards</strong>
      <div class="card-list">
        <div>Runes</div>
        <div>{state.revealed.get(Card.Rune)}</div>
        <div>Elder Signs</div>
        <div>{state.revealed.get(Card.ElderSign)}</div>
      </div>
      <p>
        {msg()[0]} {msg()[1]}
      </p>
      <h2>
        <strong>{players[active()].name}</strong>'s turn
      </h2>
      <For each={players}>
        {(p, i) => (
          <>
            <strong>{p.name}'s hand</strong>
            <div class="card-row">
              <For each={p.cards}>
                {() => (
                  <>
                    <button
                      class="card-small"
                      disabled={p.name === players[active()].name || revealing()}
                      onClick={() => choose(p, i())}
                    >
                      ?
                    </button>
                  </>
                )}
              </For>
            </div>
          </>
        )}
      </For>
      {/* Reveal Popup */}
      <Show when={revealing()}>
        <div class="modal">
          <p>You {msg()[1]}</p>
          <button onClick={() => nextMove()}>OK</button>
        </div>
      </Show>
    </>
  );
};

export default Round;
