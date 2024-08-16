import { type Component, For, Show, type Setter } from "solid-js";
import CharacterPool from "./CharacterPool";
import { useState } from "../../state";
import { Stage } from "..";

interface Props {
  setStage: Setter<Stage>;
}

const Lobby: Component = (props: Props) => {
  const { Players, investigatorCount, cultistCount, initialise } = useState();

  function start() {
    initialise();
    props.setStage(Stage.Reveal);
  }

  let nameInput: HTMLInputElement;

  function add() {
    let name = nameInput.value;
    if (!name) {
      alert("Enter a name to add!");
      return;
    }
    if (
      Players.get()
        .map((p) => p.name)
        .indexOf(name) > -1
    ) {
      alert(`${name} has already been added!`);
      return;
    }
    Players.add(name);
    nameInput.value = "";
  }

  function remove(index: number) {
    Players.remove(index);
  }
  return (
    <>
      <h1>Don't Mess With Cthulhu!</h1>
      <p style="margin-bottom: var(--size-4)">
        This is an "offline" version where the game is played on a single
        device.
      </p>
      <CharacterPool />
      <h3 style="margin-top: var(--size-4)">Players</h3>
      <Show when={Players.get().length > 0}>
        <div class="player-list">
          <For each={Players.get()}>
            {(p, index) => (
              <>
                <div style="font-size: 1.5rem">
                  {index() + 1}. {p.name}
                </div>
                <div>
                  <button onClick={() => remove(index())}>Remove</button>
                </div>
              </>
            )}
          </For>
        </div>
      </Show>
      <Show when={Players.count() < 4}>
        <p style="color: red">
          <strong>
            Need {4 - Players.count()} more player
            {4 - Players.count() !== 1 ? "s" : ""}
          </strong>
        </p>
      </Show>
      <Show
        when={
          Players.count() >= 4 &&
          investigatorCount() + cultistCount() < Players.count()
        }
      >
        <p style="color: red">
          <strong>Not enough investigators and cultists</strong>
        </p>
      </Show>
      <h4 style="margin-top: var(--size-7); margin-bottom: var(--size-2)">
        Add Players
      </h4>
      <input
        ref={nameInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            add();
          }
        }}
        id="name"
        type="text"
      />
      <button onClick={() => add()}>Add</button>
      <button
        class="green"
        style="margin-top: var(--size-1)"
        disabled={Players.count() < 4}
        onClick={() => start()}
      >
        Start
      </button>
    </>
  );
};

export default Lobby;
