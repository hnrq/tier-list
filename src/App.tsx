import { Component } from 'solid-js';

import { SortableProvider } from 'context/sortable';
import { TierListProvider } from 'context/tierList';
import Home from 'pages/Home';

import 'theme/index.scss';

const App: Component = () => (
  <SortableProvider options={{ draggable: '.product--draggable' }}>
    <TierListProvider>
      <Home />
    </TierListProvider>
  </SortableProvider>
);

export default App;
