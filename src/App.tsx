import { createSignal, type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Stage, stageMap } from "./stages";
import { useState } from "./state";
import { debug } from "./util";

const App: Component = () => {
  const { Players } = useState();
  const { reset } = useState();
  const [stage, setStage] = createSignal(Stage.Lobby);

  function exit() {
    setStage(Stage.Lobby);
    reset();
  }

  return (
    <main>
      <Dynamic component={stageMap.get(stage())} setStage={setStage} />
      <Show when={stage() !== Stage.Lobby}>
        <button style="margin-top: var(--size-1)" onClick={() => exit()}>Exit</button>
      </Show>
      <Show when={debug}>
        <pre>DEBUG</pre>
        <pre>
          {JSON.stringify(
            Players.get().map((p) => ({
              name: p.name,
              team: p.team(),
              cards: p.Cards.get(),
            })),
            null,
            2,
          )}
        </pre>
      </Show>
    </main>
  );
};

export default App;
