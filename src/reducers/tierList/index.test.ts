import products from '__mocks__/products';
import tiers from '__mocks__/tiers';

import reducer, { initialState } from '.';
import * as actions from './actions';

describe('reducers/tierList()', () => {
  it('handles ADD_PRODUCT action by adding a product to unranked products', () => {
    const [key, productToBeAdded] = Object.entries(products)[0];
    expect(
      reducer(initialState, actions.addProduct({ product: productToBeAdded }))
    ).toEqual({
      tiers: {},
      unrankedProducts: {
        [key]: productToBeAdded,
      },
    });
  });

  describe('handles REMOVE_PRODUCT', () => {
    it("removes a product from unranked products if 'unranked' is provided", () => {
      const id = Object.keys(products)[10];
      const result = reducer(
        { tiers: {}, unrankedProducts: products },
        actions.removeProduct({ id, from: 'unranked' })
      );

      expect(Object.keys(result.unrankedProducts)).toHaveLength(
        Object.keys(products).length - 1
      );
      expect(result.unrankedProducts).not.toHaveProperty(id);
    });

    it('removes a product from a rank if an ID is provided', () => {
      const id = Object.keys(products)[10];
      const [key, tier] = Object.entries(tiers)[0];
      const result = reducer(
        {
          tiers: {
            [key]: {
              ...tier,
              items: products,
            },
          },
          unrankedProducts: {},
        },
        actions.removeProduct({ id, from: key })
      );

      expect(Object.keys(result.tiers[key].items)).toHaveLength(
        Object.keys(products).length - 1
      );
      expect(result.tiers[key].items).not.toHaveProperty(id);
    });
  });

  it('handles ADD_TIER action by adding a new tier', () => {
    const tierToBeAdded = Object.values(tiers)[0];
    const result = reducer(
      initialState,
      actions.addTier({
        title: tierToBeAdded.title,
        label: tierToBeAdded.label,
      })
    );
    expect(Object.values(result.tiers)[0].label).toEqual(tierToBeAdded.label);
    expect(Object.values(result.tiers)[0].title).toEqual(tierToBeAdded.title);
  });

  it('handles REMOVE_TIER action by removing a tier', () => {
    const tierId = Object.keys(tiers)[2];
    const result = reducer(
      {
        tiers,
        unrankedProducts: {},
      },
      actions.removeTier({ id: tierId })
    );

    expect(Object.keys(result.tiers)).toHaveLength(
      Object.keys(tiers).length - 1
    );
    expect(result.tiers).not.toHaveProperty(tierId);
  });

  describe('handles MOVE_PRODUCT', () => {
    it('moves to unranked if unranked is provided as target', () => {
      const [tierId, tier] = Object.entries(tiers)[0];
      const productsInTier = Object.entries(products).slice(0, 5);
      const [productId, product] = productsInTier[2];
      const result = reducer(
        {
          tiers: {
            [tierId]: {
              ...tier,
              items: Object.fromEntries(productsInTier),
            },
          },
          unrankedProducts: {},
        },
        actions.moveProduct({ id: productId, from: tierId, to: 'unranked' })
      );

      expect(Object.keys(result.tiers[tierId].items)).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.tiers[tierId].items).not.toHaveProperty(productId);
      expect(result.unrankedProducts).toEqual({ [productId]: product });
    });

    it('moves from unranked if unranked is provided as source', () => {
      const [tierId, tier] = Object.entries(tiers)[0];
      const productsInTier = Object.entries(products).slice(0, 5);
      const [productId, product] = productsInTier[2];
      const result = reducer(
        {
          tiers: {
            [tierId]: {
              ...tier,
              items: {},
            },
          },
          unrankedProducts: Object.fromEntries(productsInTier),
        },
        actions.moveProduct({ id: productId, from: 'unranked', to: tierId })
      );

      expect(Object.keys(result.unrankedProducts)).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.unrankedProducts).not.toHaveProperty(productId);
      expect(result.tiers[tierId].items).toEqual({ [productId]: product });
    });

    it('moves between tiers', () => {
      const [firstTierId, firstTier] = Object.entries(tiers)[0];
      const [secondTierId, secondTier] = Object.entries(tiers)[1];
      const productsInTier = Object.entries(products).slice(0, 5);
      const [productId, product] = productsInTier[2];
      const result = reducer(
        {
          tiers: {
            [firstTierId]: {
              ...firstTier,
              items: Object.fromEntries(productsInTier),
            },
            [secondTierId]: {
              ...secondTier,
              items: {},
            },
          },
          unrankedProducts: {},
        },
        actions.moveProduct({
          id: productId,
          from: firstTierId,
          to: secondTierId,
        })
      );

      expect(Object.keys(result.tiers[firstTierId])).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.tiers[firstTierId]).not.toHaveProperty(productId);
      expect(result.tiers[secondTierId].items).toEqual({
        [productId]: product,
      });
    });
  });
});
