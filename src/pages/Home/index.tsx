import { Component } from 'solid-js';

import Product, { ProductProps } from 'components/Product';
import Tier from 'components/Tier';
import Products from 'containers/Products';

import './index.scss';

const Home: Component<unknown> = () => {
  return (
    <div class="home">
      <Tier
        title="SSS"
        label="perfect"
        items={[]}
        renderItem={(product: ProductProps) => (
          <Product draggable {...product} />
        )}
      />
      <Products />
    </div>
  );
};

export default Home;
