import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
    roles = [
      {
        imgUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=3087&auto=format&fit=crop", 
        tagline: "Order Your Favorite Food", 
        description: "Get delicious meals delivered to your doorstep from the best local restaurants. Quick, easy, and convenient.", 
        button: "Sign Up to Order"

      },
      {
        imgUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940&auto=format&fit=crop", 
        tagline: "Partner with Us", 
        description: "Grow your business by reaching new customers in your area. Join our network of restaurant partners today.", 
        button: "Add Your Restaurant"

      },
      {
        imgUrl: "img/Delivery_Agent.png", 
        tagline: "Become a Rider", 
        description: "Earn money on your own schedule. Deliver with Dine Cognizant and enjoy the flexibility of being your own boss.", 
        button: "Sign Up to Deliver"
      }
    ]
}
