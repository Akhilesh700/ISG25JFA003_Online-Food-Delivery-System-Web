import { Component, inject, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ZardInputDirective } from "@shared/components/input/input.directive";
import { AppState } from 'src/app/state/app.state';
import { addCartNote } from 'src/app/state/cart/cart.action';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [ZardInputDirective, FormsModule],
  templateUrl: './note-modal.html',
  styleUrl: './note-modal.css'
})
export class NoteModal {
  
  protected readonly store = inject<Store<AppState>>(Store);
  
  note:string = "";

  saveNote() {
    const note = this.note
    this.store.dispatch(addCartNote({note}));
  }



}
