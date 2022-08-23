import { Component, createMemo, JSXElement, mergeProps, Show } from 'solid-js';

import { Product as ProductType } from 'reducers/tierList';

import './index.scss';

export interface ProductProps
  extends Pick<
    ProductType,
    'title' | 'id' | 'originalPrice' | 'images' | 'store'
  > {
  draggable?: boolean;
  action?: {
    label: string | JSXElement;
    onClick: (e: MouseEvent) => void;
  };
}

const Product: Component<ProductProps> = (_props) => {
  const props = mergeProps({ draggable: false }, _props);
  const price = createMemo(() => props.originalPrice.max.toString().split('.'));

  return (
    <div
      class="product"
      data-id={props.id}
      classList={{
        'product--draggable': props.draggable,
      }}
    >
      <div class="product__content">
        <Show when={props.action !== undefined}>
          <div
            role="button"
            class="product__action"
            onClick={(e) => {
              props.action?.onClick(e);
            }}
          >
            {props.action?.label}
          </div>
        </Show>
        <img class="product__image" src={props.images[0]} />
        <div>
          <span class="product__name">{props.title}</span>
          <span class="product__store">{props.store}</span>
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
