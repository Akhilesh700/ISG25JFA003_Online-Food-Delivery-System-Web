export interface IDish {
    itemId: number;
    name: string;
    imgUrl: string;
    cuisineType?: string;
    isAvailable: boolean;
    isVegetarian: boolean;
    description: string;
    price: number;
    rating: number;
    quantity: number;
    category: string;
}


export interface IResturant {
    id: number;
    name: string;
    address: string;
    bannerUrl: string;
    logoUrl: string;
    rating: number;
    ETA: string;
    isOpen: boolean;
    deliveryFee: number;
    dishes: IDish[];
}

export interface Restaurant {
  restId: number;     
  name: string;
  imgUrl: string;
  address: string;
  phone: string;
  rating: number;      
  openTime: string;  
  closeTime: string; 
}