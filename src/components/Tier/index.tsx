import { Component, createMemo, For, JSXElement, onMount } from 'solid-js';

import { useSortable } from 'context/sortable';
import { Tier as TierType } from 'reducers/tierList';
import { getContrastYIQ, randomColor } from 'utils';

import './index.scss';

export interface TierProps extends Omit<TierType, 'items'> {
  items: unknown[];
  renderItem: (children: unknown) => JSXElement;
  color?: string;
}

// TODO: @hnrq make Tier editable
const Tier: Component<TierProps> = (props) => {
  const sortable = useSortable();
  const backgroundColor = createMemo(() => props.color ?? randomColor());
  let itemContainerRef;

  onMount(() => {
    sortable().addContainer(itemContainerRef);
  });
  return (
    <div class="tier">
      <div
        class="tier__title-container"
        style={{
          'background-color': backgroundColor(),
          color: getContrastYIQ(backgroundColor()),
        }}
      >
        <span class="tier__title">{props.title}</span>
        <span class="tier__label">{props.label}</span>
      </div>
      <div
        data-id={props.id}
        class="tier__item-container"
        ref={itemContainerRef}
      >
        <For each={props.items}>{(item) => props.renderItem(item)}</For>
      </div>
    </div>
  );
};

export default Tier;
