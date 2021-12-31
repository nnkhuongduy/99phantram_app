import { Supply } from 'src/models/supply';

export const getCategoryText = (supply: Supply) =>
  `${supply.categories[0].name}, ${supply.categories[1].name}`;
