import { Component, For, onMount } from 'solid-js';

import Product from 'components/Product';
import Tier from 'components/Tier';
import { useTierList } from 'context/tierList';
import { Product as ProductType } from 'reducers/tierList';

import './index.scss';

const Tiers: Component = () => {
  const [tierList] = useTierList();

  return (
    <div class="tiers">
      <div class="tiers__header">
        <h2 class="tiers__title">Tiers</h2>
        <button class="button button--link">Add Tier</button>
      </div>
      <div class="tiers__items">
        <For each={Object.values(tierList.tiers)}>
          {(tier) => (
            <Tier
              renderItem={(product: ProductType) => (
                <Product draggable {...product} />
              )}
              {...tier}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default Tiers;
