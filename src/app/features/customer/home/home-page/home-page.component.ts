import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TopRestaurantsComponent } from '../top-restaurants/top-restaurants';
import { CuisinesComponent } from '../cuisines/cuisines';
import { OffersComponent } from '../offers/offers';
import { PopularDishesComponent } from '../popular-dishes/popular-dishes';
import { HowItWorksComponent } from '../how-it-works/how-it-works';
import { TestimonialsComponent } from '../testimonials/testimonials';
import { AppPromoComponent } from '../app-promo/app-promo';
import { Hero } from '../hero/hero';
import { Footer } from '../../landing/footer/footer/footer';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    Hero,
    OffersComponent,
    CuisinesComponent,
    PopularDishesComponent,
    TopRestaurantsComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    AppPromoComponent,
    Footer
],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy{
  title = 'dine-cognizant';

  ngOnInit(): void {
    console.log("Mounting Home")
  }

  ngOnDestroy(): void {
    console.log("Unmounting Home")
  }

}