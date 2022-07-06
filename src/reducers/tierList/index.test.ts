import products from '__mocks__/products';
import tiers from '__mocks__/tiers';

import reducer from '.';
import * as actions from './actions';

describe('reducers/tierList()', () => {
  it('handles tierList/addProduct action by adding a product to unranked products', () => {
    const productToBeAdded = products[0];
    expect(
      reducer(
        {
          tiers: {},
          unrankedProducts: [],
        },
        actions.addProducts({ products: [productToBeAdded] })
      )
    ).toEqual({
      tiers: {},
      unrankedProducts: [productToBeAdded],
    });
  });

  describe('handles tierList/removeProduct action', () => {
    it("removes a product from unranked products if 'unranked' is provided", () => {
      const { id } = products[10];
      const result = reducer(
        { tiers: {}, unrankedProducts: products },
        actions.removeProduct({ id, from: 'unranked' })
      );

      expect(Object.keys(result.unrankedProducts)).toHaveLength(
        Object.keys(products).length - 1
      );
    });

    it('removes a product from a rank if an ID is provided', () => {
      const { id } = products[10];
      const [key, tier] = Object.entries(tiers)[0];
      const result = reducer(
        {
          tiers: {
            [key]: {
              ...tier,
              items: products,
            },
          },
          unrankedProducts: [],
        },
        actions.removeProduct({ id, from: key })
      );

      expect(Object.keys(result.tiers[key].items)).toHaveLength(
        Object.keys(products).length - 1
      );
    });
  });

  it('handles tierList/removeTier action', () => {
    const tierToBeAdded = Object.values(tiers)[0];
    const result = reducer(
      {
        tiers: {},
        unrankedProducts: [],
      },
      actions.addTier({
        title: tierToBeAdded.title,
        label: tierToBeAdded.label,
      })
    );
    expect(Object.values(result.tiers)[0].label).toEqual(tierToBeAdded.label);
    expect(Object.values(result.tiers)[0].title).toEqual(tierToBeAdded.title);
  });

  it('handles tierList/removeTier action', () => {
    const tierId = Object.keys(tiers)[2];
    const result = reducer(
      {
        tiers,
        unrankedProducts: [],
      },
      actions.removeTier({ id: tierId })
    );

    expect(Object.keys(result.tiers)).toHaveLength(
      Object.keys(tiers).length - 1
    );
    expect(result.tiers).not.toHaveProperty(tierId);
  });

  describe('handles tierList/moveProduct action', () => {
    it('moves to unranked if unranked is provided as target', () => {
      const [tierId, tier] = Object.entries(tiers)[0];
      const productsInTier = products.slice(0, 5);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: {
            [tierId]: {
              ...tier,
              items: productsInTier,
            },
          },
          unrankedProducts: [],
        },
        actions.moveProduct({
          id: product.id,
          from: { id: tierId, index },
          to: { id: 'unranked', index },
        })
      );

      expect(Object.keys(result.tiers[tierId].items)).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.unrankedProducts[0]).toEqual(product);
    });

    it('moves from unranked if unranked is provided as source', () => {
      const [tierId, tier] = Object.entries(tiers)[0];
      const productsInTier = products.slice(0, 5);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: {
            [tierId]: {
              ...tier,
              items: [],
            },
          },
          unrankedProducts: productsInTier,
        },
        actions.moveProduct({
          id: product.id,
          from: { id: 'unranked', index },
          to: { id: tierId, index },
        })
      );

      expect(Object.keys(result.unrankedProducts)).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.tiers[tierId].items[0]).toEqual(product);
    });

    it('moves between tiers', () => {
      const [firstTierId, firstTier] = Object.entries(tiers)[0];
      const [secondTierId, secondTier] = Object.entries(tiers)[1];
      const productsInTier = products.slice(0, 5);
      const productsInTierTwo = products.slice(5, 10);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: {
            [firstTierId]: {
              ...firstTier,
              items: productsInTier,
            },
            [secondTierId]: {
              ...secondTier,
              items: productsInTierTwo,
            },
          },
          unrankedProducts: [],
        },
        actions.moveProduct({
          id: product.id,
          from: { id: firstTierId, index },
          to: { id: secondTierId, index },
        })
      );

      expect(Object.keys(result.tiers[firstTierId])).toHaveLength(
        productsInTier.length - 1
      );
      expect(result.tiers[secondTierId].items[index]).toEqual(product);
    });
  });

  it('handles tierList/moveTier action', () => {
    const productsInTier = products.slice(0, 5);
    const from = 2;
    const to = 4;
    const tier = Object.values(tiers)[from];
    const result = reducer(
      {
        tiers,
        unrankedProducts: [],
      },
      actions.moveTier({ from, to })
    );

    expect(Object.values(result.tiers)[to]).toEqual(tier);
  });
});
