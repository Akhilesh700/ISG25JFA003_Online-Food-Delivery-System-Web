import { AfterViewInit, Component, ElementRef, ViewChild, } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl:'./hero.css'
})
export class HeroComponent implements AfterViewInit {

  @ViewChild('dailyGuests') dailyGuestsEl!: ElementRef;
  @ViewChild('variousMenu') variousMenuEl!: ElementRef;

  ngAfterViewInit() {
    this.animateCount(1000, this.dailyGuestsEl, 10);
    this.animateCount(100, this.variousMenuEl, 1);
  }

  private animateCount(target: number, element: ElementRef, step:number) {
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        element.nativeElement.innerText = `${current}+`;
        clearInterval(interval);
      } else {
        element.nativeElement.innerText = `${current}+`;
      }
    }, 10);
  }
}