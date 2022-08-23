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
    sortable()
      .on('drag:stop', (e) => {
        e.preventDefault();
      })
      .on('sortable:stop', (e) => {
        dispatch(
          moveProduct({
            from: {
              id: e.oldContainer.dataset.id,
              index: e.oldIndex,
            },
            to: {
              id: e.newContainer.dataset.id,
              index: e.newIndex,
            },
          })
        );
      });
  });

  return (
    <div class="home container-lg">
      <Tiers />
      <Products />
    </div>
  );
};

export default Home;
