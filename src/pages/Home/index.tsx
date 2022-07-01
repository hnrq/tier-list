import { Component, onMount, createSignal } from 'solid-js';

import Products from 'containers/Products';
import Tiers from 'containers/Tiers';
import { useSortable } from 'context/sortable';
import { useTierList } from 'context/tierList';
import { moveProduct } from 'reducers/tierList/actions';

import './index.scss';

const Home: Component<unknown> = () => {
  const [productCollapse, setProductCollapse] = createSignal(true);
  const sortable = useSortable();
  const [_tierList, dispatch] = useTierList();

  onMount(() => {
    sortable()
      .on('drag:stop', (e) => {
        e.cancel();
      })
      .on('sortable:stop', (e) => {
        dispatch(
          moveProduct({
            id: e.dragEvent.originalSource.getAttribute('data-id'),
            from: {
              id: e.oldContainer.getAttribute('data-id'),
              index: e.oldIndex,
            },
            to: {
              id: e.newContainer.getAttribute('data-id'),
              index: e.newIndex,
            },
          })
        );
      });
  });

  return (
    <div class="home">
      <Tiers />
      <button onClick={() => setProductCollapse((collapse) => !collapse)}>
        Show Products
      </button>
      <div
        class="home__product-menu"
        classList={{
          open: !productCollapse(),
        }}
      >
        <Products />
      </div>
    </div>
  );
};

export default Home;
