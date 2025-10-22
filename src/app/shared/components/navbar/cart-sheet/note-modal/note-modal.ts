import { Component } from '@angular/core';
import { ZardInputDirective } from "@shared/components/input/input.directive";

@Component({
  selector: 'app-note-modal',
  imports: [ZardInputDirective],
  templateUrl: './note-modal.html',
  styleUrl: './note-modal.css'
})
export class NoteModal {

}
