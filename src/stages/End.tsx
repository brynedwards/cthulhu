import { Component, For, Show, createSignal } from "solid-js";
import { StageProps } from ".";
import { useState } from "../state";
import { Card, TeamEnum } from "../game";
import { toCssClass } from "../util";

const End: Component = (_props: StageProps) => {
  const [msg, setMsg] = createSignal("???");
  const { round, state } = useState();
  const { players, revealed } = state;
  const investigators = players.filter((p) => p.team === TeamEnum.Investigator);
  const cultists = players.filter((p) => p.team === TeamEnum.Cultist);
  const winner = (() => {
    if (revealed.get(Card.Cthulhu)) {
      setMsg("Cthulhu has been unleashed!");
      return TeamEnum.Cultist;
    }
    if (round() > 4) {
      setMsg("The investigators ran out of time!");
      return TeamEnum.Cultist;
    }
    if (revealed.get(Card.ElderSign) === players.length) {
      setMsg("All the Elder Signs were revealed!");
      return TeamEnum.Investigator;
    }
    return null;
  })();

  const noWinner = <p>No winner...? That's not supposed to happen...</p>;
  return (
    <>
      <Show when={winner !== null} fallback={noWinner}>
        <h1 class={toCssClass(winner)}>{winner}s win!</h1>
        <h2>{msg()}</h2>
      </Show>
      <h3 class="investigator" style="margin-top: 1em">
        Investigators
      </h3>
      <For each={investigators}>{(p) => <strong>{p.name}</strong>}</For>
      <h3 class="cultist" style="margin-top: 1em">
        Cultists
      </h3>
      <For each={cultists}>{(p) => <strong>{p.name}</strong>}</For>
    </>
  );
};

export default End;
