import products from '__mocks__/products';
import tiers from '__mocks__/tiers';

import reducer from '.';
import * as actions from './actions';

describe('reducers/tierList()', () => {
  it('handles tierList/addProducts action by adding a product to unranked products', () => {
    const productToBeAdded = products[0];
    expect(
      reducer(
        {
          tiers: [],
          unrankedProducts: [],
        },
        actions.addProducts({ products: [productToBeAdded] })
      )
    ).toEqual({
      tiers: [],
      unrankedProducts: [productToBeAdded],
    });
  });

  describe('handles tierList/removeProduct action', () => {
    it("removes a product from unranked products if 'unranked' is provided", () => {
      const { id } = products[10];
      const result = reducer(
        { tiers: [], unrankedProducts: products },
        actions.removeProduct({ id, from: 'unranked' })
      );

      expect(result.unrankedProducts).toHaveLength(products.length - 1);
    });

    it('removes a product from a rank if an ID is provided', () => {
      const { id } = products[10];
      const tier = tiers[0];
      const result = reducer(
        {
          tiers: [
            {
              ...tier,
              items: products,
            },
          ],
          unrankedProducts: [],
        },
        actions.removeProduct({ id, from: tier.id })
      );

      expect(result.tiers[0].items).toHaveLength(products.length - 1);
    });
  });

  it('handles tierList/addTier action', () => {
    const tierToBeAdded = tiers[0];
    const result = reducer(
      {
        tiers: [],
        unrankedProducts: [],
      },
      actions.addTier({
        title: tierToBeAdded.title,
        label: tierToBeAdded.label,
      })
    );
    expect(result.tiers[0].label).toEqual(tierToBeAdded.label);
    expect(result.tiers[0].title).toEqual(tierToBeAdded.title);
  });

  it('handles tierList/removeTier action', () => {
    const { id } = tiers[2];
    const result = reducer(
      {
        tiers,
        unrankedProducts: [],
      },
      actions.removeTier({ id })
    );

    expect(result.tiers).toHaveLength(tiers.length - 1);
    expect(result.tiers[2].id).not.toBe(id);
  });

  describe('handles tierList/moveProduct action', () => {
    it('moves to unranked if unranked is provided as target', () => {
      const tiersAvailable = tiers.slice(0, 2);
      const productsInTier = products.slice(0, 5);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: [...tiersAvailable, { ...tiers[3], items: productsInTier }],
          unrankedProducts: [],
        },
        actions.moveProduct({
          from: { id: tiers[3].id, index },
          to: { id: 'unranked', index },
        })
      );
      expect(result.tiers[2].items).toHaveLength(productsInTier.length - 1);
      expect(result.unrankedProducts[0]).toEqual(product);
    });

    it('moves from unranked if unranked is provided as source', () => {
      const tier = tiers[0];
      const productsInTier = products.slice(0, 5);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: [
            {
              ...tier,
              items: [],
            },
          ],
          unrankedProducts: productsInTier,
        },
        actions.moveProduct({
          from: { id: 'unranked', index },
          to: { id: tier.id, index },
        })
      );

      expect(result.unrankedProducts).toHaveLength(productsInTier.length - 1);
      expect(result.tiers[0].items[0]).toEqual(product);
    });

    it('moves between tiers', () => {
      const firstTier = tiers[0];
      const secondTier = tiers[1];
      const productsInTier = products.slice(0, 5);
      const productsInTierTwo = products.slice(5, 10);
      const index = 2;
      const product = productsInTier[index];
      const result = reducer(
        {
          tiers: [
            { ...firstTier, items: productsInTier },
            { ...secondTier, items: productsInTierTwo },
          ],
          unrankedProducts: [],
        },
        actions.moveProduct({
          from: { id: firstTier.id, index },
          to: { id: secondTier.id, index },
        })
      );

      expect(result.tiers[0].items).toHaveLength(productsInTier.length - 1);
      expect(result.tiers[1].items[index]).toEqual(product);
    });
  });

  it('handles tierList/moveTier action', () => {
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
