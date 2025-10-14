import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { HeroComponent } from '../hero/hero';
import { Footer } from '../footer/footer/footer';
import { CulinaryWizardsComponent } from '../culinary-wizards/culinary-wizards/culinary-wizards';
import { HotSellingRecipes } from '../hot-selling-recipes/hot-selling-recipes/hot-selling-recipes';
import { Signup } from '../signup/signup';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    Footer,
    CulinaryWizardsComponent,
    HotSellingRecipes,
    Signup
  ],
  templateUrl: './landing-page.html',
})
export class LandingPageComponent {}