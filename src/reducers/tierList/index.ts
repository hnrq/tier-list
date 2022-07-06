import { createReducer } from '@reduxjs/toolkit';
import shortId from 'shortid';

import mockProducts from '__mocks__/products';
import mockTiers from '__mocks__/tiers';

import * as actions from './actions';

export interface Tier {
  id: string;
  title: string;
  label: string;
  items: Product[];
}

export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  vendor: string;
}

export interface TierList {
  tiers: Record<string, Tier>;
  unrankedProducts: Product[];
}

export const initialState: TierList = {
  tiers: mockTiers,
  unrankedProducts: mockProducts,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(actions.addProducts, (state, action) => {
      const { products } = action.payload;
      state.unrankedProducts = [...state.unrankedProducts, ...products];
    })
    .addCase(actions.removeProduct, (state, action) => {
      const { from, id } = action.payload;
      if (action.payload.from === 'unranked')
        state.unrankedProducts = state.unrankedProducts.filter(
          (product) => product.id !== id
        );
      else
        state.tiers[from].items = state.tiers[from].items.filter(
          (product) => product.id !== id
        );
    })
    .addCase(actions.moveProduct, (state, action) => {
      const { from, to } = action.payload;
      let productToBeMoved;

      if (from.id === 'unranked') {
        productToBeMoved = state.unrankedProducts[from.index];
        state.unrankedProducts.splice(from.index, 1);
      } else {
        productToBeMoved = state.tiers[from.id].items[from.index];
        state.tiers[from.id].items.splice(from.index, 1);
      }

      if (to.id === 'unranked')
        state.unrankedProducts.splice(to.index, 0, productToBeMoved);
      else state.tiers[to.id].items.splice(to.index, 0, productToBeMoved);
    })
    .addCase(actions.removeTier, (state, action) => {
      const { id } = action.payload;

      state.unrankedProducts = {
        ...state.tiers[id].items,
        ...state.unrankedProducts,
      };
      delete state.tiers[id];
    })
    .addCase(actions.addTier, (state, action) => {
      const { title, label } = action.payload;
      const id = shortId.generate();
      state.tiers[id] = { id, title, label, items: [] };
    })
    .addCase(actions.moveTier, (state, action) => {
      const { from, to } = action.payload;
      const tiers = Object.entries(state.tiers);
      const movedTier = tiers[from];
      tiers.splice(from, 1);
      tiers.splice(to, 0, movedTier);

      state.tiers = Object.fromEntries(tiers);
    });
});
