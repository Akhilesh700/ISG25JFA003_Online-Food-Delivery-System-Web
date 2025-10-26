export interface SearchResultItem{
    type: 'restaurant' | 'menuItem';
    id: number;
    name: string;
    imageUrl?: string;
    cuisine?: string;
    rating?: number;
    address?: string;
    description?: string;
    price?: number;
    restaurantId?: number;
    restaurantName?: string;
}
export interface SearchResponse {
    results: SearchResultItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalResults: number;
        limit: number;
    };
}