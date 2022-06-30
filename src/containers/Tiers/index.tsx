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
  );
};

export default Tiers;
