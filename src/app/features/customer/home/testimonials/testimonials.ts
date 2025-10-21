import { Component } from '@angular/core';

interface Testimonial {
  quote: string;
  author: string;
  title: string,
  avatarUrl: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.html',
})
export class TestimonialsComponent {
  // Helper to create an array for star ratings
  counter(i: number) {
    return new Array(i);
  }

  testimonials: Testimonial[] = [
    {
      quote: "Amazing service! Food arrived hot and fresh. The delivery was faster than expected.",
      author: 'Sankalp Salve',
      avatarUrl: 'img/avatar/avatar1.png',
      title: 'Amazing Service',
      rating: 5
    },
    {
      quote: "Best food delivery app! Great variety of restaurants and excellent customer support.",
      author: 'Jyoti Anand',
      title: 'Best food delivery app',
      avatarUrl: 'img/avatar/avatar2.png',
      rating: 5
    },
    {
      quote: "Love the app interface and the deals. Makes ordering food so convenient!",
      author: 'Sarthak Yadav',
      title: 'Best User Interface',
      avatarUrl: 'img/avatar/avatar3.png',
      rating: 5
    }
  ];
}