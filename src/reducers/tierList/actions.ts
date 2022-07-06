import { createAction } from '@reduxjs/toolkit';

import { Product } from '.';

export const addProducts = createAction<{ products: Product[] }>(
  'tierList/addProduct'
);
export const removeProduct = createAction<{ id: string; from: string }>(
  'tierList/removeProduct'
);
export const moveProduct = createAction<{
  from: { id: string; index: number };
  to: { id: string; index: number };
}>('tierList/moveProduct');
export const removeTier = createAction<{ id: string }>('tierList/removeTier');
export const addTier = createAction<{ title: string; label: string }>(
  'tierList/addTier'
);

export const moveTier = createAction<{ from: number; to: number }>(
  'tierList/moveTier'
);
