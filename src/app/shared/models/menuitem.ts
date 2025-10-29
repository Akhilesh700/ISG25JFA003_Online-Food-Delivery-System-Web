export interface MenuItem {
  itemId: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  cuisineType: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  size: 'small' | 'medium' | 'large' | 'extraLarge';
  prepTime: number;
}