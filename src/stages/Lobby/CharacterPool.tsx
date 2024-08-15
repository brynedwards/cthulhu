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
      <div style="display: inline-grid; grid-template-columns: auto auto auto;">
        <div>
          <label for="investigators">Investigators</label>
        </div>
        <div style="margin: 0 1em">{investigatorCount()}</div>
        <div>
          <RangeInput
            id="investigators"
            value={investigatorCount()}
            min={0}
            max={maxPlayers()}
            disabled={maxPlayers() < 4}
            bind={setInvestigatorCount}
          />
        </div>
        <div>
          <label for="cultists">Cultists</label>
        </div>
        <div style="margin: 0 1em">{cultistCount()}</div>
        <div>
          <RangeInput
            id="cultists"
            value={cultistCount()}
            min={0}
            max={maxPlayers()}
            disabled={maxPlayers() < 4}
            bind={setCultistCount}
          />
        </div>
      </div>
    </>
  );
};
