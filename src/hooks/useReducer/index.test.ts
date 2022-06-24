import * as store from 'solid-js/store';

import useReducer, { ActionType, ReducerType } from '.';

describe('hooks/useReducer()', () => {
  it('creates a store with the provided initial state', () => {
    const spy = vi.spyOn(store, 'createStore');
    const initialState = {};
    useReducer<Record<string, string>>((state) => state, initialState);

    expect(spy).toHaveBeenCalledWith(initialState);
  });

  describe('dispatch', () => {
    it('returns a dispatch function that calls the reducer with a provided action', () => {
      const action = { type: 'action', payload: { key: 'value' } };
      const reducerFn = vi.fn();
      const reducer = useReducer<Record<string, string>>(reducerFn, {});
      reducer[1](action);
      expect(reducerFn).toHaveBeenCalledWith({}, action);
    });

    it('reconciles the current store with the returned state from reducer', () => {
      const mockAction = { type: 'action', payload: { key: 'value' } };
      const reducerFn: ReducerType<Record<string, unknown>> = (
        state,
        action: ActionType
      ) => ({ ...state, ...action.payload });
      const [state, dispatch] = useReducer<Record<string, unknown>>(reducerFn, {
        initialKey: 'initialValue',
      });
      dispatch(mockAction);
      expect(state).toEqual({ initialKey: 'initialValue', key: 'value' });
    });
  });
});
