import { createSignal, type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Stage, stageMap } from "./stages";
import { useState } from "./state";
import { debug } from "./util";

const App: Component = () => {
  const { Players } = useState();
  const { reset } = useState();
  const [stage, setStage] = createSignal(Stage.Lobby);
  const [exiting, setExiting] = createSignal(false);

  function exit() {
    setExiting(false);
    setStage(Stage.Lobby);
    reset();
  }

  return (
    <main>
      <Dynamic component={stageMap.get(stage())} setStage={setStage} />
      <Show when={stage() !== Stage.Lobby}>
        <button style="margin-top: var(--size-5)" onClick={() => setExiting(true)}>Exit</button>
      </Show>
    <Show when={exiting()}>
      <div class="modal">
        <p>Really exit?</p>
        <div>
        <button style="margin-right: var(--size-2)" onClick={() => setExiting(false)}>Cancel</button>
        <button style="background-color: var(--red-9)" onClick={() => exit()}>Exit</button>
        </div>
      </div>
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
