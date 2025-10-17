import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable, of, Subscriber } from "rxjs";
import { IDish, IResturant } from "src/app/models/resturantInterface";


// @Injectable({
//     providedIn: 'root'
// })
// export class ResturantService {

//     protected readonly http = inject(HttpClient)


//     private resturant: IResturant = {
//         "id": 1,
//         "name": "The Spice Route",
//         "address": "123 GST Road, Guindy, Chennai, 600032",
//         "bannerUrl": "https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg",
//         "logoUrl": "https://example.com/images/spice_route_logo.png",
//         "rating": 4.5,
//         "ETA": "38 min",
//         "isOpen": true,
//         "deliveryFee": 50,
//         "dishes": [
//             {
//             "id": 101,
//             "name": "Chicken Chettinad",
//             "description": "A fiery and aromatic chicken curry from the Chettinad region of Tamil Nadu.",
//             "price": 350,
//             "imageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTF5CN9VnfhjMjaGa8HnrzAqlHqMp6WTOEus2IEoOTQbVPTQSxv80uQZ1jfdwhg9fHQXNplWKQoyCDhAd0RlVwlxRQDIP_guR7Evf-A7F6Q",
//             "isAvailable": true,
//             "category": "Main Course",
//             "isVegetarian": false,
//             "rating": 4.8,
//             quantity: 0
//             },
//             {
//             "id": 102,
//             "name": "Paneer Tikka Masala",
//             "description": "Grilled cottage cheese cubes in a spiced, creamy tomato-based gravy.",
//             "price": 320,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeSb6KZv9gA1M9Cvs4LjwnLN9tyRlqV52UQvrlJI57rjXg5PL03Qlrre_vcGRJ_vlueNYdpbfgIsR5bkd6_sjYiMLTLquE0RIl9H2JGUGj",
//             "isAvailable": true,
//             "category": "Main Course",
//             "isVegetarian": true,
//             "rating": 4.6,
//             quantity: 0
//             },
//             {
//             "id": 103,
//             "name": "Gobi 65",
//             "description": "A popular South Indian snack made with deep-fried cauliflower florets marinated in hot spices.",
//             "price": 240,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkuVKAA3O-fPiaJEBds7dGT6_WZPUM1jLUAg&s",
//             "isAvailable": true,
//             "category": "Appetizer",
//             "isVegetarian": true,
//             "rating": 4.5,
//             quantity: 0
//             },
//             {
//             "id": 104,
//             "name": "Mutton Sukka",
//             "description": "A dry preparation of tender mutton pieces cooked with shallots, ginger, and a blend of traditional spices.",
//             "price": 420,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnS5MwxKT0gwfOZiDG61nieO4d_cYNbj5M-w&s",
//             "isAvailable": true,
//             "category": "Appetizer",
//             "isVegetarian": false,
//             "rating": 4.9,
//             quantity: 0
//             },
//             {
//             "id": 105,
//             "name": "Ambur Chicken Biryani",
//             "description": "A distinctive biryani from Ambur made with short-grain seeraga samba rice and a special spice blend.",
//             "price": 380,
//             "imageUrl": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-9d5A_fMlTMv21U_pgVDpYbJG0I1Pc_rz6Q9XiehBW4VeY0cEKk5D9PDlqfE5PjgngqxdsgjI5iunlKo0EvBiQOPhMaNyHmYYckKAj5LSOA",
//             "isAvailable": true,
//             "category": "Main Course",
//             "isVegetarian": false,
//             "rating": 4.9,
//             quantity: 0
//             },
//             {
//             "id": 106,
//             "name": "Malabar Parotta",
//             "description": "Flaky, layered flatbread popular across South India. Perfect with any curry.",
//             "price": 60,
//             "imageUrl": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRgMwcFRjfj70KmnJmzZOW1lbVOqa4xLsfDmk0dHM1TlCJRGWR7VSy3AoAVRMsVvc-45sMi-A3d5iEhYfMEC-CG7J52Vqr1DPKMZTQOYeA42Q",
//             "isAvailable": true,
//             "category": "Breads",
//             "isVegetarian": true,
//             "rating": 4.7,
//             quantity: 0
//             },
//             {
//             "id": 107,
//             "name": "Elaneer Payasam",
//             "description": "A refreshing and creamy pudding made with tender coconut pulp and milk.",
//             "price": 180,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLDhuwDY2Q7e1wOQvngRD5pAKY15dPy0aqmQ&s",
//             "isAvailable": false,
//             "category": "Desserts",
//             "isVegetarian": true,
//             "rating": 4.8,
//             quantity: 0
//             }
//         ]
//     }



//     getResturantById(resturantId: number): IResturant {



//         const dishes$ = this.http.get<IDish[]>(`http://localhost:8081/menu/${resturantId}`, {
//             headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcmVuMUBlcmVuLmNvbSIsInVzZXJJZCI6IjgiLCJpYXQiOjE3NjA1OTg2NjYsImV4cCI6OTk5OTk5OTk5OX0.Ad11a_kML_xAxvuKTbusgE-fpCn2aVPDoCcMG19e53ekyyWHw7UvpisHj_clTq8zeN5yd6HH00O9nzaS_Xaoww'}
//         }).pipe(
//             map(backendDishes => {
//                 return backendDishes.map(dish => ({
//                     id: dish.id,
//                     name: dish.name,
//                     imageUrl: dish.imageUrl,
//                     cuisineType: dish.cuisineType,
//                     isAvailable: dish.isAvailable,
//                     isVegetarian: dish.isVegetarian,
//                     description: dish.description,
//                     price: dish.price,
//                     rating: Math.max(1.4, dish.id * 97639742637 % 5),       // Default value
//                     quantity: 0,     // Default value
//                     category: 'Main Menu'

//                 }))
//             })
//         )

//         const restaurant$ = this.http.get<IResturant>(`http://localhost:8081/menu/restaurant/${resturantId}`, {
//             headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcmVuMUBlcmVuLmNvbSIsInVzZXJJZCI6IjgiLCJpYXQiOjE3NjA1OTg2NjYsImV4cCI6OTk5OTk5OTk5OX0.Ad11a_kML_xAxvuKTbusgE-fpCn2aVPDoCcMG19e53ekyyWHw7UvpisHj_clTq8zeN5yd6HH00O9nzaS_Xaoww'}
//         })

//         console.log(dishes$)
//         console.log(restaurant$)

        
        
//         //  return of(this.resturant)
//         //     .pipe(
//         //         map(restaurant => {
//         //             // Create a new array of dishes, each with the quantity property
//         //             const dishesWithQuantity = restaurant.dishes.map(dish => {
//         //                 return { ...dish, quantity: 0 };
//         //             });
                    
//         //             // Return a *new restaurant object* with the modified dishes array
//         //             return {
//         //                 ...restaurant, // Copy all original restaurant properties
//         //                 dishes: dishesWithQuantity // Overwrite the dishes property with the new array
//         //             };
//         //         })
//         //     );



//         return this.resturant

//     }

// }


@Injectable({
    providedIn:'root'
})
export class RestaurantService {
    private token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcmVuMUBlcmVuLmNvbSIsInVzZXJJZCI6IjgiLCJpYXQiOjE3NjA1OTg2NjYsImV4cCI6OTk5OTk5OTk5OX0.Ad11a_kML_xAxvuKTbusgE-fpCn2aVPDoCcMG19e53ekyyWHw7UvpisHj_clTq8zeN5yd6HH00O9nzaS_Xaoww";
    protected readonly http = inject(HttpClient);

    getResturantById(resturantId: number): Observable<IResturant> {

        // 1. Define the observable for fetching the restaurant details
        const restaurantDetails$ = this.http.get<IResturant>(`http://localhost:8081/api/v1/menu/restaurant/${resturantId}`, {
            headers: { 'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcmVuMUBlcmVuLmNvbSIsInVzZXJJZCI6IjgiLCJpYXQiOjE3NjA1OTg2NjYsImV4cCI6OTk5OTk5OTk5OX0.Ad11a_kML_xAxvuKTbusgE-fpCn2aVPDoCcMG19e53ekyyWHw7UvpisHj_clTq8zeN5yd6HH00O9nzaS_Xaoww`} // ⚠️ Note: Hardcoding tokens is not secure
        });

         // 2. Define the observable for fetching and mapping the dishes
        const dishes$ = this.http.get<IDish[]>(`http://localhost:8081/api/v1/menu/${resturantId}`, {
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlcmVuMUBlcmVuLmNvbSIsInVzZXJJZCI6IjgiLCJpYXQiOjE3NjA1OTg2NjYsImV4cCI6OTk5OTk5OTk5OX0.Ad11a_kML_xAxvuKTbusgE-fpCn2aVPDoCcMG19e53ekyyWHw7UvpisHj_clTq8zeN5yd6HH00O9nzaS_Xaoww' }
        }).pipe(
            
            map(backendDishes  => backendDishes.map(dish =>{
                return {
                ...dish,
                rating: parseFloat((Math.max(3.5, (dish.itemId * 9763974263) % 5)).toFixed(1)),
                quantity: 0,
                category: dish.cuisineType || 'Main Menu'
                }
            } 
                
        ))
        );

        return forkJoin({
            restaurant: restaurantDetails$, // Assigns result of restaurantDetails$ to 'restaurant' key
            dishes: dishes$                // Assigns result of dishes$ to 'dishes' key
        }).pipe(
            // 4. Once both are complete, use 'map' to combine their results into a single object
            map(response => {
                const { restaurant, dishes } = response;
                
                // Return a new restaurant object with the fetched dishes array merged into it
                return {
                    ...restaurant,
                    dishes: dishes
                };
            })
        )










    }



}