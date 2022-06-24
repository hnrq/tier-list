import { Component, createMemo, mergeProps, Show } from 'solid-js';

import './index.scss';

export interface ProductProps {
  image: string;
  name: string;
  price: number;
  vendor: string;
  draggable?: boolean;
}

const Product: Component<ProductProps> = (_props) => {
  const props = mergeProps({ draggable: false }, _props);
  const price = createMemo(() => props.price.toString().split('.'));

  return (
    <div
      class="product"
      classList={{
        'product--draggable': props.draggable,
      }}
    >
      <div class="product__content">
        <img class="product__image" src={props.image} />
        <div>
          <span class="product__name">{props.name}</span>
          <span class="product__vendor">{props.vendor}</span>
        </div>
        <div class="product__price">
          <span class="product__dollar-sign">$</span>
          <span class="product__dollar">{price()[0]}</span>
          <Show when={price()[1]}>
            <span class="product__cents">.{price()[1]}</span>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Product;