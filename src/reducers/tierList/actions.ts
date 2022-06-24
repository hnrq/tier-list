import { createAction } from '@reduxjs/toolkit';

import { Product } from '.';

export const addProduct = createAction<{ product: Product }>(
  'tierList/addProduct'
);
export const removeProduct = createAction<{ id: string; from: string }>(
  'tierList/removeProduct'
);
export const moveProduct = createAction<{
  id: string;
  from: string;
  to: string;
}>('tierList/moveProduct');
export const removeTier = createAction<{ id: string }>('tierList/removeTier');
export const addTier = createAction<{ title: string; label: string }>(
  'tierList/addTier'
);
