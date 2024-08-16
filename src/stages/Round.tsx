import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { useState } from "../state";
import { Card, Player } from "../game";
import { Stage, StageProps } from ".";

const verbs = ["found", "discovered", "unearthed"];
const Round: Component = (props: StageProps) => {
  const { Players, Round, Revealed } = useState();
  const [msg, setMsg] = createSignal(["", ""]);
  const [turn, setTurn] = createSignal(1);
  const [revealing, setRevealing] = createSignal(false);
  let lastRevealed = null;
  let chosenPlayer = null;
  const keyDownEvent = useKeyDownEvent();

  function choose(p: Player, i: number) {
    // Choose a random card from player p
    const r = Math.floor(Math.random() * p.Cards.get().length);
    const card = p.Cards.pop(r);
    Revealed.add(card);
    const a = card === Card.Cthulhu ? "" : "a";
    const n = card === Card.ElderSign ? "n" : "";
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    setMsg([p.name, `${verb} ${a}${n} ${card}!`]);
    setRevealing(true);
    lastRevealed = card;
    chosenPlayer = i;
  }

  function nextMove() {
    console.log("Elder Signs:", Revealed.elderSigns());
    console.log("Player count:", Players.count());
    if (
      lastRevealed === Card.Cthulhu ||
      Revealed.elderSigns() === Players.count()
    ) {
      props.setStage(Stage.End);
    }
    // Set player p as active player
    Players.setActive(chosenPlayer);
    setTurn(turn() + 1);
    if (turn() === Players.count() + 1) {
      Round.next();
      if (Round.current() > 4) {
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
      <h1>Round {Round.current()}</h1>
      <h2>
        Turn {turn()} of {Players.count()}
      </h2>
      <strong>Revealed cards</strong>
      <div class="card-list">
        <div>Runes</div>
        <div>{Revealed.runes()}</div>
        <div>Elder Signs</div>
        <div>{Revealed.elderSigns()}</div>
      </div>
      <p>
        {msg()[0]} {msg()[1]}
      </p>
      <h2>
        <strong>{Players.active().name}</strong>'s turn
      </h2>
      <For each={Players.get()}>
        {(p, i) => (
          <>
            <strong>{p.name}'s hand</strong>
            <div class="card-row">
              <For each={p.Cards.get()}>
                {() => (
                  <>
                    <button
                      class="card-small"
                      disabled={p.name === Players.active().name || revealing()}
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
