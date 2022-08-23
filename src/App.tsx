import { Component } from 'solid-js';

import { SortableProvider } from 'context/sortable';
import { TierListProvider } from 'context/tierList';
import Home from 'pages/Home';

import 'theme/index.scss';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
      formSubmit: (form) => void;
    }
  }
}

const App: Component = () => (
  <SortableProvider options={{ draggable: '.product--draggable', delay: 150 }}>
    <TierListProvider>
      <Home />
    </TierListProvider>
  </SortableProvider>
);

export default App;
