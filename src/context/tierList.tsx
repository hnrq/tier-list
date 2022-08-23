import { Component, createContext, ParentProps, useContext } from 'solid-js';

import createReducer, { ActionType } from 'hooks/createReducer';
import tierList, { initialState, TierList } from 'reducers/tierList';

export const TierListContext =
  createContext<[TierList, (action: ActionType) => void]>();

export const TierListProvider: Component<ParentProps<unknown>> = (props) => {
  const [store, dispatch] = createReducer<TierList>(tierList, initialState);

  return (
    <TierListContext.Provider value={[store, dispatch]}>
      {props.children}
    </TierListContext.Provider>
  );
};

export const useTierList = () => useContext(TierListContext);
