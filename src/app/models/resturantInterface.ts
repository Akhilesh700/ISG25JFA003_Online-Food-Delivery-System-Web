export interface IDish {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: string;
    isVegetarian: boolean;
    rating: number;
    quantity: number;
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