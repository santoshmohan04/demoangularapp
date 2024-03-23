import { Component } from '@angular/core';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [EmployeeListComponent],
})
export class MainComponent {}
