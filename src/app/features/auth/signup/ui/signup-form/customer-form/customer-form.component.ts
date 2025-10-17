import { Component, OnInit } from '@angular/core';
import { ZardCheckboxComponent } from "@shared/components/checkbox/checkbox.component";
import { ZardFormControlComponent, ZardFormLabelComponent, ZardFormFieldComponent } from "@shared/components/form/form.component";
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  imports: [ZardCheckboxComponent, ZardFormControlComponent, ZardFormLabelComponent, ZardFormFieldComponent, ZardBreadcrumbModule]
})
export class CustomerFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
