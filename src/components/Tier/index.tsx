import { Component, For, JSXElement, onMount } from 'solid-js';

import { useSortable } from 'context/sortable';
import { Tier } from 'reducers/tierList';
import { randomColor } from 'utils';

import './index.scss';

export interface TierProps extends Tier {
  renderItem: (children: unknown) => JSXElement;
  color?: string;
}

// TODO: @hnrq make Tier editable
const Tier: Component<TierProps> = (props) => {
  const sortable = useSortable();
  let itemContainerRef;

  onMount(() => {
    sortable().addContainer(itemContainerRef);
  });
  return (
    <div class="tier">
      <div
        class="tier__title-container"
        style={{ 'background-color': props.color ?? randomColor() }}
      >
        <span class="tier__title">{props.title}</span>
        <span class="tier__label">{props.label}</span>
      </div>
      <div class="tier__item-container" ref={itemContainerRef}>
        <For each={props.items}>{(item) => props.renderItem(item)}</For>
      </div>
    </div>
  );
};

export default Tier;
