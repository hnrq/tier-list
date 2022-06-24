import {
  Accessor,
  Component,
  createContext,
  createMemo,
  mergeProps,
  ParentProps,
  useContext,
} from 'solid-js';

import { Draggable, Sortable } from '@shopify/draggable';

const SortableContext = createContext<Accessor<Draggable>>();

interface SortableProviderProps {
  options: ConstructorParameters<typeof Sortable>[1];
  containers?: HTMLElement[];
}

export const SortableProvider: Component<ParentProps<SortableProviderProps>> = (
  _props
) => {
  const props = mergeProps({ containers: [] }, _props);
  const sortable = createMemo(
    () => new Sortable(props.containers, props.options)
  );

  return (
    <SortableContext.Provider value={sortable}>
      {props.children}
    </SortableContext.Provider>
  );
};

export const useSortable = () => useContext(SortableContext);
