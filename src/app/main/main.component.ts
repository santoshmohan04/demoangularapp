import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectEmployeeList } from '../store/common.selectors';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [EmployeeListComponent, CommonModule, FormsModule],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild(EmployeeListComponent) employeeList!: EmployeeListComponent;
  modelState: boolean = false;
  templateName: string | null = '';
  deletebtn: any = true;
  employeedata = [];
  count: number = 0;
  searchTerm: string = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectEmployeeList)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.length > 0) {
          this.employeedata = res;
          this.count = res.filter((t) => t.isChecked === true).length;
        }
      });
  }

  toggleSelectAll() {
    if (this.count === this.employeedata.length) {
      this.employeeList.selectAllCheckBox(false);
    } else {
      this.employeeList.selectAllCheckBox(true);
    }
  }
  openModal(name: string) {
    this.employeeList.opentoggle(name);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
