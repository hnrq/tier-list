import { Component, createSignal, For, onMount } from 'solid-js';

import { Sortable } from '@hnrq/draggable';

import Modal from 'components/Modal';
import Product from 'components/Product';
import Tier from 'components/Tier';
import AddTierForm from 'containers/AddTierForm';
import { useTierList } from 'context/tierList';
import { Product as ProductType } from 'reducers/tierList';
import { addTier, moveTier } from 'reducers/tierList/actions';

import './index.scss';

const Tiers: Component = () => {
  const [openTierModal, setOpenTierModal] = createSignal(false);
  const [tierList, dispatch] = useTierList();
  let tierContainerRef;

  onMount(() => {
    new Sortable(tierContainerRef, {
      draggable: '.tier',
      delay: 500,
    })
      .on('drag:stop', (e) => {
        e.preventDefault();
      })
      .on('sortable:stop', (e) => {
        dispatch(
          moveTier({
            from: e.oldIndex,
            to: e.newIndex,
          })
        );
      });
  });

  return (
    <div class="tiers">
      <Modal
        open={openTierModal()}
        onClose={() => setOpenTierModal(false)}
        size="sm"
      >
        <h2 class="ml-2">Add Tier</h2>
        <AddTierForm
          onSubmit={(form) => {
            dispatch(addTier(form));
            setOpenTierModal(false);
          }}
        />
      </Modal>
      <div class="tiers__header">
        <h2 class="tiers__title">Tiers</h2>
        <button
          class="button button--link"
          onClick={() => setOpenTierModal(true)}
        >
          Add Tier
        </button>
      </div>
      <div class="tiers__items" ref={tierContainerRef}>
        <For each={tierList.tiers}>
          {(tier) => (
            <Tier
              renderItem={(product: ProductType) => (
                <Product draggable {...product} />
              )}
              {...tier}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default Tiers;
