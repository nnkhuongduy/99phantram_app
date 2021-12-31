import { Supply } from "src/models/supply";

export const getLocationText = (supply: Supply) => {
  return `${supply.locations[0].name}, ${supply.locations[1].name}, ${supply.locations[2].name}, ${supply.address}`;
}