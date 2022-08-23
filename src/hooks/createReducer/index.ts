import { createStore, reconcile } from 'solid-js/store';

export type ActionType = Record<string, unknown> & {
  type: string;
  payload: Record<string, unknown>;
};

export type ReducerType<T> = (state: T, action: ActionType) => T;

const createReducer = <T extends object>(
  reducer: ReducerType<T>,
  state?: T
): [T, (action: ActionType) => void] => {
  const [store, setStore] = createStore<T>(state);
  const dispatch = (action: ActionType) => {
    state = reducer(state, action);
    setStore(reconcile(state));
  };
  return [store, dispatch];
};

export default createReducer;
