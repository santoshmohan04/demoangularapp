import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ApiserviceService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employeeData: Array<any> = [];

  constructor(private apiservice: ApiserviceService) {}

  ngOnInit(): void {
    this.apiservice.getRecords().subscribe({
      next: (res) => {
        this.employeeData = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
