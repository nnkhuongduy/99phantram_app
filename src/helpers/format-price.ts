export const formatPrice = (price: number) =>
  price ? `${price} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
