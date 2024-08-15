import { Component, For, Show, createSignal } from "solid-js";
import { Stage, StageProps } from ".";
import { useState } from "../state";
import { TeamEnum } from "../game";
import { debug, toCssClass } from "../util";

const Reveal: Component = (props: StageProps) => {
  const { Players, Round } = useState();
  const [index, setIndex] = createSignal(0);
  const [revealed, setRevealed] = createSignal(false);
  const currentPlayer = () => Players.get()[index()];
  const n = () => (currentPlayer().team() === TeamEnum.Investigator ? "n" : "");

  function next() {
    setRevealed(false);
    setIndex(index() + 1);
  }

  function play() {
    props.setStage(Stage.Round);
  }

  const still = () => {
    const round = Round.current();
    if (round === 2) return "(still) ";
    if (round === 3) return "(still?!?!) ";
    return "";
  };

  return (
    <>
      <h1>ROUND {Round.current()}</h1>
      <p style={revealed() ? "visibility: hidden" : ""}>
        Please pass the device to
      </p>
      <h2>{currentPlayer().name}</h2>
      <button disabled={revealed()} onClick={() => setRevealed(true)}>
        Reveal
      </button>
      <div classList={{ hidden: !revealed(), "flex-centered": true }}>
        <p>
          You are {still()}a{n()}{" "}
        </p>
        <h2 class={toCssClass(currentPlayer().team())}>
          {currentPlayer().team()}
        </h2>
        <p>Your cards are</p>
        <div class="reveal-card-list">
          <For each={currentPlayer().Cards.get()}>
            {(c) => <strong class={toCssClass(c)}>{c}</strong>}
          </For>
        </div>
      </div>
      <Show
        when={index() < Players.count() - 1}
        fallback={
          <button disabled={!revealed()} onClick={() => play()}>
            Play
          </button>
        }
      >
        <button disabled={!revealed()} onClick={() => next()}>
          Next
        </button>
      </Show>
      <Show when={debug}>
        <button onClick={() => play()}>SKIP</button>
      </Show>
    </>
  );
};

export default Reveal;
