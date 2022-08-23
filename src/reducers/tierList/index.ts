import { createReducer } from '@reduxjs/toolkit';
import shortId from 'shortid';

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
  images: string[];
  title: string;
  categoryId: string;
  store: string;
  ratings: {
    totalStar: number;
    averageStar: number;
    totalStartCount: number;
    fiveStarCount: number;
    fourStarCount: number;
    threeStarCount: number;
    twoStarCount: number;
    oneStarCount: number;
  };
  currency: string;
  originalPrice: {
    min: number;
    max: number;
  };
  salePrice?: {
    min: number;
    max: number;
  };
}

export interface TierList {
  tiers: Tier[];
  unrankedProducts: Product[];
}

export const initialState = JSON.parse(localStorage.getItem('tier-list')) ?? {
  tiers: mockTiers,
  unrankedProducts: [],
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(actions.addProducts, (state, action) => {
      const { products } = action.payload;
      const productsToBeAdded = products.filter(
        (productToBeAdded) =>
          state.unrankedProducts.findIndex(
            (product) => product.id === productToBeAdded.id
          ) === -1
      );

      state.unrankedProducts = [
        ...productsToBeAdded,
        ...state.unrankedProducts,
      ];
    })
    .addCase(actions.removeProduct, (state, action) => {
      const { from, id } = action.payload;
      if (action.payload.from === 'unranked')
        state.unrankedProducts = state.unrankedProducts.filter(
          (product) => product.id !== id
        );
      else {
        const tierIndex = state.tiers.findIndex((tier) => tier.id === from);
        state.tiers[tierIndex].items = state.tiers[tierIndex].items.filter(
          (product) => product.id !== id
        );
      }
    })
    .addCase(actions.moveProduct, (state, action) => {
      const { from, to } = action.payload;
      let productToBeMoved;
      if (from.id === 'unranked') {
        productToBeMoved = state.unrankedProducts[from.index];
        state.unrankedProducts.splice(from.index, 1);
      } else {
        const tierIndex = state.tiers.findIndex((tier) => tier.id === from.id);
        productToBeMoved = state.tiers[tierIndex].items[from.index];
        state.tiers[tierIndex].items.splice(from.index, 1);
      }

      if (to.id === 'unranked')
        state.unrankedProducts.splice(to.index, 0, productToBeMoved);
      else {
        const tierIndex = state.tiers.findIndex((tier) => tier.id === to.id);
        state.tiers[tierIndex].items.splice(to.index, 0, productToBeMoved);
      }
    })
    .addCase(actions.removeTier, (state, action) => {
      const { id } = action.payload;
      const tierIndex = state.tiers.findIndex((tier) => tier.id === id);

      state.unrankedProducts = {
        ...state.tiers[tierIndex].items,
        ...state.unrankedProducts,
      };

      state.tiers.splice(tierIndex, 1);
    })
    .addCase(actions.addTier, (state, action) => {
      const { title, label } = action.payload;
      const id = shortId.generate();
      state.tiers.push({ id, title, label, items: [] });
    })
    .addCase(actions.moveTier, (state, action) => {
      const { from, to } = action.payload;
      const [movedTier] = state.tiers.splice(from, 1);
      state.tiers.splice(to, 0, movedTier);
    });
});
