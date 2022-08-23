import { Product } from 'reducers/tierList';

const fetchProducts = async (url: string): Promise<Product[]> => {
  const data = await fetch(
    `/api/products?${new URLSearchParams({ url }).toString()}`
  );
  return data.json() as Promise<Product[]>;
};

export default fetchProducts;
