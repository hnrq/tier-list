import { Component } from 'solid-js';

import Product, { ProductProps } from 'components/Product';
import Rank from 'components/Rank';
import Products from 'containers/Products';
import { SortableProvider } from 'context/sortable';

import 'theme/index.scss';

const App: Component = () => (
  <SortableProvider options={{ draggable: '.product--draggable' }}>
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        gap: '16px',
      }}
    >
      <Rank
        title="SSS"
        label="perfect"
        items={[]}
        renderItem={(product: ProductProps) => (
          <Product draggable {...product} />
        )}
      />
    </div>
    <Products />
  </SortableProvider>
);

export default App;
