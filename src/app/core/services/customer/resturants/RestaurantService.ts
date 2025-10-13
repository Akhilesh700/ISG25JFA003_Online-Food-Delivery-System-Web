import { Injectable } from "@angular/core";
import { IResturant } from "src/app/models/resturantInterface";


@Injectable({
    providedIn: 'root'
})
export class ResturantService {
    private resturant: IResturant = {
        "id": 1,
        "name": "The Spice Route",
        "address": "123 GST Road, Guindy, Chennai, 600032",
        "bannerUrl": "https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg",
        "logoUrl": "https://example.com/images/spice_route_logo.png",
        "rating": 4.5,
        "ETA": "38 min",
        "isOpen": true,
        "deliveryFee": 50,
        "dishes": [
            {
            "id": 101,
            "name": "Chicken Chettinad",
            "description": "A fiery and aromatic chicken curry from the Chettinad region of Tamil Nadu.",
            "price": 350,
            "imageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTF5CN9VnfhjMjaGa8HnrzAqlHqMp6WTOEus2IEoOTQbVPTQSxv80uQZ1jfdwhg9fHQXNplWKQoyCDhAd0RlVwlxRQDIP_guR7Evf-A7F6Q",
            "isAvailable": true,
            "category": "Main Course",
            "isVegetarian": false,
            "rating": 4.8
            },
            {
            "id": 102,
            "name": "Paneer Tikka Masala",
            "description": "Grilled cottage cheese cubes in a spiced, creamy tomato-based gravy.",
            "price": 320,
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeSb6KZv9gA1M9Cvs4LjwnLN9tyRlqV52UQvrlJI57rjXg5PL03Qlrre_vcGRJ_vlueNYdpbfgIsR5bkd6_sjYiMLTLquE0RIl9H2JGUGj",
            "isAvailable": true,
            "category": "Main Course",
            "isVegetarian": true,
            "rating": 4.6
            },
            {
            "id": 103,
            "name": "Gobi 65",
            "description": "A popular South Indian snack made with deep-fried cauliflower florets marinated in hot spices.",
            "price": 240,
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkuVKAA3O-fPiaJEBds7dGT6_WZPUM1jLUAg&s",
            "isAvailable": true,
            "category": "Appetizer",
            "isVegetarian": true,
            "rating": 4.5
            },
            {
            "id": 104,
            "name": "Mutton Sukka",
            "description": "A dry preparation of tender mutton pieces cooked with shallots, ginger, and a blend of traditional spices.",
            "price": 420,
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnS5MwxKT0gwfOZiDG61nieO4d_cYNbj5M-w&s",
            "isAvailable": true,
            "category": "Appetizer",
            "isVegetarian": false,
            "rating": 4.9
            },
            {
            "id": 105,
            "name": "Ambur Chicken Biryani",
            "description": "A distinctive biryani from Ambur made with short-grain seeraga samba rice and a special spice blend.",
            "price": 380,
            "imageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-9d5A_fMlTMv21U_pgVDpYbJG0I1Pc_rz6Q9XiehBW4VeY0cEKk5D9PDlqfE5PjgngqxdsgjI5iunlKo0EvBiQOPhMaNyHmYYckKAj5LSOA",
            "isAvailable": true,
            "category": "Main Course",
            "isVegetarian": false,
            "rating": 4.9
            },
            {
            "id": 106,
            "name": "Malabar Parotta",
            "description": "Flaky, layered flatbread popular across South India. Perfect with any curry.",
            "price": 60,
            "imageUrl": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRgMwcFRjfj70KmnJmzZOW1lbVOqa4xLsfDmk0dHM1TlCJRGWR7VSy3AoAVRMsVvc-45sMi-A3d5iEhYfMEC-CG7J52Vqr1DPKMZTQOYeA42Q",
            "isAvailable": true,
            "category": "Breads",
            "isVegetarian": true,
            "rating": 4.7
            },
            {
            "id": 107,
            "name": "Elaneer Payasam",
            "description": "A refreshing and creamy pudding made with tender coconut pulp and milk.",
            "price": 180,
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLDhuwDY2Q7e1wOQvngRD5pAKY15dPy0aqmQ&s",
            "isAvailable": false,
            "category": "Desserts",
            "isVegetarian": true,
            "rating": 4.8
            }
        ]
    }

    getResturantById(resturantId: number): IResturant {
        return this.resturant;
    }

}