import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [EmployeeListComponent, CommonModule, FormsModule],
})
export class MainComponent {
  @ViewChild(EmployeeListComponent) employeeList!: EmployeeListComponent;
  modelState: boolean = false;
  templateName: string | null = '';
  deletebtn: any = true;
  selectAll: any = true;
  count: number = 0;
  searchTerm: string = '';
  constructor() {
  }

  toggleSelectAll() {
    this.employeeList.selectAllCheckBox(this.selectAll);

  }
  openModal(value: boolean, name: string) {
    this.modelState = value;
    this.templateName = name;

  }
  handelModel(e: any) {
    console.log(e);
    e.closeModel ? this.modelState = e.closeModel : this.modelState = false;
    e.selectAll ? this.selectAll = !e.selectAll : this.selectAll = !e.selectAll;
    e.deletebtn ? this.deletebtn = !e.deletebtn : this.deletebtn = !e.deletebtn;
    e.count ? this.count = e.count : this.count = 0;
    console.log('deletebtn', this.deletebtn);

  }
}
