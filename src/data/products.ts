export type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  tags: string[];
};

export const products: Product[] = [
  { id: 1, name: 'Glow Face Serum', price: '$25.00', image: '/images/product-1.jpg', category: 'Face Care', tags: ['Dry', 'Normal', 'Anti-aging'] },
  { id: 2, name: 'Hydrating Cream', price: '$35.00', image: '/images/product-2.jpg', category: 'Face Care', tags: ['Dry', 'Sensitive'] },
  { id: 3, name: 'Vitamin C Toner', price: '$18.00', image: '/images/product-3.jpg', category: 'Face Care', tags: ['Oily', 'Combination', 'Brightening'] },
  { id: 4, name: 'Exfoliating Scrub', price: '$22.00', image: '/images/product-4.jpg', category: 'Body Care', tags: ['Oily', 'Normal', 'Acne'] },
  { id: 5, name: 'Night Repair Oil', price: '$45.00', image: '/images/product-5.jpg', category: 'Face Care', tags: ['Dry', 'Anti-aging'] },
  { id: 6, name: 'Daily Sunscreen SPF 50', price: '$30.00', image: '/images/product-6.jpg', category: 'Face Care', tags: ['All', 'Protection'] },
  { id: 7, name: 'Purifying Clay Mask', price: '$28.00', image: '/images/product-7.jpg', category: 'Face Care', tags: ['Oily', 'Acne', 'Combination'] },
  { id: 8, name: 'Rosewater Mist', price: '$15.00', image: '/images/product-8.jpg', category: 'Face Care', tags: ['Sensitive', 'Dry', 'Redness'] },
  { id: 9, name: 'Nourishing Lip Balm', price: '$12.00', image: '/images/category-lip.jpg', category: 'Lip Care', tags: ['Dry', 'All'] },
  { id: 10, name: 'Revitalizing Body Lotion', price: '$32.00', image: '/images/category-body.jpg', category: 'Body Care', tags: ['Dry', 'Normal'] },
  { id: 11, name: 'Gentle Foaming Cleanser', price: '$20.00', image: '/images/category-face.jpg', category: 'Face Care', tags: ['Sensitive', 'Normal'] },
  { id: 12, name: 'Advanced Eye Cream', price: '$38.00', image: '/images/product-1.jpg', category: 'Face Care', tags: ['Anti-aging', 'Dark Circles'] },
];
