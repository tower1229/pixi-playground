import React, { createContext, useReducer, useContext } from "react";

type StoreType = {
  moving: boolean;
  direction: "left" | "right" | "up" | "down";
};

type StoreDispatch = {
  type: string;
  param?: Record<string, unknown>;
};

const initialState: StoreType = { moving: false, direction: "right" };

function reducer(state: StoreType, action: StoreDispatch) {
  const result: StoreType = { ...state };

  switch (action.type) {
    case "move.left":
      result.moving = true;
      result.direction = "left";
      break;
    case "move.right":
      result.moving = true;
      result.direction = "right";
      break;
    case "move.up":
      result.moving = true;
      result.direction = "up";
      break;
    case "move.down":
      result.moving = true;
      result.direction = "down";
      break;
    case "move.stop":
      result.moving = false;
      result.direction = state.direction;
      break;

    default:
      throw new Error();
  }
  return result;
}

const StateContext = createContext(initialState);
const DispatchContext = createContext<React.Dispatch<StoreDispatch> | null>(
  null
);

function useStateStore() {
  return useContext(StateContext);
}

function useDispatchStore() {
  return useContext(DispatchContext);
}

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useStateStore, useDispatchStore, StoreProvider };
