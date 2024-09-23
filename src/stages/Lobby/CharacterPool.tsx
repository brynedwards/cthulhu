import { createEffect } from "solid-js";
import RangeInput from "./RangeInput";
import { useState } from "../../state";

// Pool of default number of investigators and cultists per total players. So
// for example, if there are 4 players, there will be 3 investigators and 2
// cultists in the pool.
const pools = new Map([
  [4, [3, 2]],
  [5, [4, 2]],
  [6, [4, 2]],
  [7, [5, 3]],
  [8, [6, 3]],
]);

export default () => {
  const { setState, state } = useState();
  const maxPlayers = () => Math.max(1, state.players.length);
  createEffect(() => {
    let c = state.players.length;
    if (c < 4) return;
    const [investigatorCount, cultistCount] = pools.get(c) || [c, c];
    setState("investigators", investigatorCount);
    setState("cultists", cultistCount);
  });
  return (
    <>
      <h2>Character Pool</h2>
      <div style="margin-top: var(--size-3)">
        <label for="investigators">Investigators: {state.investigators}</label>
      </div>
      <RangeInput
        id="investigators"
        value={state.investigators}
        min={0}
        max={maxPlayers()}
        disabled={maxPlayers() < 4}
        bind={(val) => setState("investigators", val)}
      />
      <div style="margin-top: var(--size-3)">
        <label for="cultists">Cultists: {state.cultists}</label>
      </div>
      <RangeInput
        id="cultists"
        value={state.cultists}
        min={0}
        max={maxPlayers()}
        disabled={maxPlayers() < 4}
        bind={(val) => setState("cultists", val)}
      />
    </>
  );
};
