import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlert ,NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
  
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule,NgbAlert],
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
        res = res.filter((user:any) => {
        if (
          user.firstName &&
          user.lastName &&
          user.employee_age &&
          user.employee_salary &&
          user.email &&
          user.contactNumber &&
          user.dob
        ) {
          return user;
        }
      });
        this.employeeData = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setDelete(id: any) {
    // const index = this.employeeData.findIndex((p) => p._id === id);
    // if (index >= 0) {
    //   const r = confirm('Do you really want to delete the record?');
    //   if (r) {
    //     this.apiservice.deleteRecord(id).subscribe(()=>{
    //         this.employeeData.splice(index, 1);
    //      })
    //   }
    // }
    
  }
}
