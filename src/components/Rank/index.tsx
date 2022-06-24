import { Component, For, JSXElement, onMount } from 'solid-js';

import { useSortable } from 'context/sortable';
import { randomColor } from 'utils';

import './index.scss';

export interface RankProps {
  title: string;
  label: string;
  items: unknown[];
  renderItem: (children: unknown) => JSXElement;
  color?: string;
}
// TODO: @hnrq make Rank editable
const Rank: Component<RankProps> = (props) => {
  const sortable = useSortable();
  let itemContainerRef;

  onMount(() => {
    sortable().addContainer(itemContainerRef);
  });
  return (
    <div class="rank">
      <div
        class="rank__title-container"
        style={{ 'background-color': props.color ?? randomColor() }}
      >
        <span class="rank__title">{props.title}</span>
        <span class="rank__label">{props.label}</span>
      </div>
      <div class="rank__item-container" ref={itemContainerRef}>
        <For each={props.items}>{(item) => props.renderItem(item)}</For>
      </div>
    </div>
  );
};

export default Rank;
