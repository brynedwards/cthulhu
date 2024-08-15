import { Component, For, Show, createSignal } from "solid-js";
import { StageProps } from ".";
import { useState } from "../state";
import { TeamEnum } from "../game";
import { toCssClass } from "../util";

const End: Component = (_props: StageProps) => {
  const [msg, setMsg] = createSignal("???");
  const { Players, Revealed, Round } = useState();
  const investigators = Players.get().filter(
    (p) => p.team() === TeamEnum.Investigator,
  );
  const cultists = Players.get().filter((p) => p.team() === TeamEnum.Cultist);
  const winner = (() => {
    if (Revealed.cthulhu()) {
      setMsg("Cthulhu has been unleashed!");
      return TeamEnum.Cultist;
    }
    if (Round.current() > 4) {
      setMsg("The investigators ran out of time!");
      return TeamEnum.Cultist;
    }
    if (Revealed.elderSigns() === Players.count()) {
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
      <h3 class="investigator" style="margin-top: 1em">Investigators</h3>
      <For each={investigators}>{(p) => <strong>{p.name}</strong>}</For>
      <h3 class="cultist" style="margin-top: 1em">Cultists</h3>
      <For each={cultists}>{(p) => <strong>{p.name}</strong>}</For>
    </>
  );
};

export default End;
