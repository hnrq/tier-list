import {
  Accessor,
  Component,
  createContext,
  createMemo,
  mergeProps,
  ParentProps,
  useContext,
} from 'solid-js';

import { Sortable } from '@draggable/draggable.es';

const SortableContext = createContext<Accessor<Sortable>>();

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
