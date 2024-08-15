import { createEffect } from "solid-js";
import RangeInput from "./RangeInput";
import { useState } from "../../state";

// Pool of default number of investigators and cultists per total players. So
// for example, if there are 4 players, there will be 3 investigators and 2
// cultists in the pool.
const pools = new Map([[4, [3, 2]], [5, [4, 2]], [6, [4, 2]], [7, [5, 3]], [8, [6, 3]]]);

export default () => {
  const {
    Players,
    investigatorCount,
    setInvestigatorCount,
    cultistCount,
    setCultistCount,
  } = useState();
  const maxPlayers = () => Math.max(1, Players.count());
  createEffect(() => {
    let c = Players.count();
    if (c < 4) return;
    const [investigatorCount, cultistCount] = pools.get(c) || [c, c];
    setInvestigatorCount(investigatorCount);
    setCultistCount(cultistCount);
  });
  return (
    <>
      <h2>Character Pool</h2>
        <div style="margin-top: var(--size-3)">
          <label for="investigators">Investigators</label>
        <span style="margin: 0 1em">{investigatorCount()}</span>
        </div>
          <RangeInput
            id="investigators"
            value={investigatorCount()}
            min={0}
            max={maxPlayers()}
            disabled={maxPlayers() < 4}
            bind={setInvestigatorCount}
          />
        <div style="margin-top: var(--size-3)">
          <label for="cultists">Cultists</label>
        <span style="margin: 0 1em">{cultistCount()}</span>
        </div>
          <RangeInput
            id="cultists"
            value={cultistCount()}
            min={0}
            max={maxPlayers()}
            disabled={maxPlayers() < 4}
            bind={setCultistCount}
          />
    </>
  );
};
