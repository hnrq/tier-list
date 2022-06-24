import { createReducer } from '@reduxjs/toolkit';
import shortId from 'shortid';

import * as actions from './actions';

export interface Tier {
  id: string;
  title: string;
  label: string;
  items: Record<string, Product>;
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
  unrankedProducts: Record<string, Product>;
}

export const initialState: TierList = {
  tiers: {},
  unrankedProducts: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(actions.addProduct, (state, action) => {
      const { product } = action.payload;
      state.unrankedProducts[product.id] = product;
    })
    .addCase(actions.removeProduct, (state, action) => {
      const { from, id } = action.payload;
      if (action.payload.from === 'unranked') delete state.unrankedProducts[id];
      else delete state.tiers[from].items[id];
    })
    .addCase(actions.moveProduct, (state, action) => {
      const { id, from, to } = action.payload;
      let productToBeMoved;

      if (from === 'unranked') {
        productToBeMoved = state.unrankedProducts[id];
        delete state.unrankedProducts[id];
      } else {
        productToBeMoved = state.tiers[from].items[id];
        delete state.tiers[from].items[id];
      }

      if (to === 'unranked') state.unrankedProducts[id] = productToBeMoved;
      else state.tiers[to].items[id] = productToBeMoved;
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
      state.tiers[id] = { id, title, label, items: {} };
    });
});
