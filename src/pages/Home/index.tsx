import { Component, onMount } from 'solid-js';

import Products from 'containers/Products';
import Tiers from 'containers/Tiers';
import { useSortable } from 'context/sortable';
import { useTierList } from 'context/tierList';
import { moveProduct } from 'reducers/tierList/actions';

import './index.scss';

const Home: Component<unknown> = () => {
  const sortable = useSortable();
  const [_tierList, dispatch] = useTierList();

  onMount(() => {
    sortable().on('sortable:stop', (e) => {
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
      e.dragEvent.source.remove();
      e.dragEvent.originalSource.remove();
    });
  });

  return (
    <div class="home">
      <Tiers />
      <Products />
    </div>
  );
};

export default Home;
