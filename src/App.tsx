import { Component } from 'solid-js';

import { SortableProvider } from 'context/sortable';
import Home from 'pages/Home';

import 'theme/index.scss';

const App: Component = () => (
  <SortableProvider options={{ draggable: '.product--draggable' }}>
    <Home />
  </SortableProvider>
);

export default App;
