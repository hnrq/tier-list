import { Product } from 'reducers/tierList';

const products = [
  {
    id: '1',
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    originalPrice: {
      min: 109.95,
      max: 109.95,
    },
    store: 'Your',
    images: ['https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'],
  },
  {
    id: '2',
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    originalPrice: {
      min: 22.3,
      max: 22.3,
    },
    store: 'Slim',
    images: [
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    ],
  },
  {
    id: '3',
    title: 'Mens Cotton Jacket',
    originalPrice: {
      min: 55.99,
      max: 55.99,
    },
    store: 'Great',
    images: ['https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'],
  },
  {
    id: '4',
    title: 'Mens Casual Slim Fit',
    originalPrice: {
      min: 15.99,
      max: 15.99,
    },
    store: 'The',
    images: ['https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg'],
  },
  {
    id: '5',
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    originalPrice: {
      min: 695,
      max: 695,
    },
    store: 'From',
    images: [
      'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    ],
  },
  {
    id: '6',
    title: 'Solid Gold Petite Micropave',
    originalPrice: {
      min: 168,
      max: 168,
    },
    store: 'Satisfaction',
    images: [
      'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    ],
  },
  {
    id: '7',
    title: 'White Gold Plated Princess',
    originalPrice: {
      min: 9.99,
      max: 9.99,
    },
    store: 'Classic',
    images: [
      'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    ],
  },
  {
    id: '8',
    title: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
    originalPrice: {
      min: 10.99,
      max: 10.99,
    },
    store: 'Rose',
    images: [
      'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg',
    ],
  },
  {
    id: '9',
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    originalPrice: {
      min: 64,
      max: 64,
    },
    store: 'USB',
    images: ['https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg'],
  },
  {
    id: '10',
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    originalPrice: {
      min: 109,
      max: 109,
    },
    store: 'Easy',
    images: ['https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg'],
  },
  {
    id: '11',
    title:
      'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
    originalPrice: {
      min: 109,
      max: 109,
    },
    store: '3D',
    images: ['https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg'],
  },
  {
    id: '12',
    title:
      'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
    originalPrice: {
      min: 114,
      max: 114,
    },
    store: 'Expand',
    images: ['https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg'],
  },
  {
    id: '13',
    title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin',
    originalPrice: {
      min: 599,
      max: 599,
    },
    store: '21',
    images: ['https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg'],
  },
  {
    id: '14',
    title:
      'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED',
    originalPrice: {
      min: 999.99,
      max: 999.99,
    },
    store: '49',
    images: ['https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg'],
  },
  {
    id: '15',
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    originalPrice: {
      min: 56.99,
      max: 56.99,
    },
    store: 'Note',
    images: ['https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg'],
  },
  {
    id: '16',
    title:
      "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    originalPrice: {
      min: 29.95,
      max: 29.95,
    },
    store: '100%',
    images: ['https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg'],
  },
  {
    id: '17',
    title: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
    originalPrice: {
      min: 39.99,
      max: 39.99,
    },
    store: 'Lightweight',
    images: ['https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg'],
  },
  {
    id: '18',
    title: "MBJ Women's Solid S'hort Sleeve Boat Neck V",
    originalPrice: {
      min: 9.85,
      max: 9.85,
    },
    store: '95',
    images: ['https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg'],
  },
  {
    id: '19',
    title: "Opna Women's Short Sleeve Moisture",
    originalPrice: {
      min: 7.95,
      max: 7.95,
    },
    store: '100',
    images: ['https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg'],
  },
  {
    id: '20',
    title: 'DANVOUY Womens T Shirt Casual Cotton Short',
    originalPrice: {
      min: 12.99,
      max: 12.99,
    },
    store: '95',
    images: ['https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg'],
  },
] as Product[];

export default products;
