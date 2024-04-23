import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbAlert,
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../services/loader.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import * as commonactions from '../store/common.actions';
import {
  selectEmpPageIndex,
  selectEmpPageSize,
  selectEmployeeDtls,
  selectEmployeeList,
  selectTotalEmployeeListCount,
} from '../store/common.selectors';
import { DatafilterPipe } from '../services/datafilter.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  providers: [ApiService, LoaderService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbAlert,
    ReactiveFormsModule,
    MatPaginatorModule,
    DatafilterPipe,
  ],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  paginationData = this.store.select(selectEmployeeList);
  modalRef: NgbModalRef | undefined;
  templateCreationForm!: FormGroup;
  closeResult = '';
  singleDeleteID = '';
  searchdata: string = '';
  disableDeleteButton: boolean = false;
  EmployeeEdit: boolean = false;
  employeeID = '';
  @ViewChild('EmployeeModal') private EmployeeModal!: TemplateRef<string>;
  @ViewChild('confirmdelete') private confirmdelete!: TemplateRef<string>;
  selectAll: boolean = false;
  bulkDeleteList: any = [];
  @Output() newItemEvent = new EventEmitter();
  length = this.store.select(selectTotalEmployeeListCount);
  pageSize = this.store.select(selectEmpPageSize);
  pageIndex = this.store.select(selectEmpPageIndex);
  pageSizeOptions = [8, 12, 24, 32, 48];
  destroy$: Subject<boolean> = new Subject<boolean>();
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  @Output() paginationEvent = new EventEmitter();
  pageEvent!: PageEvent;
  profilePicUrl: any =
    'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg';

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiService,
    private readonly store: Store,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public loader: LoaderService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.store.dispatch(
      commonactions.employeeactions.fetchEmployeeData({
        pageIndex: 0,
        pageSize: 8,
      })
    );
    this.getRecords();
    this.loader.show();
    this.templateCreationForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)],
      ], // Phone number regex validation
      dob: [null, [Validators.required, this.pastDateValidator()]], // Past date validation for DOB
      salary: [null, [Validators.min(100)]], // Minimum salary validation
      age: [
        null,
        [Validators.required, Validators.min(18), Validators.max(99)],
      ], // Age range validation
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e || this.pageEvent;
    this.store.dispatch(
      commonactions.employeeactions.changePaginantionData({
        pageIndex: e.pageIndex,
        pageSize: e.pageSize,
      })
    );
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  pastDateValidator() {
    return (control: { value: Date }) => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      return selectedDate < currentDate ? null : { futureDate: true };
    };
  }

  getRecords() {
    this.store
      .select(selectEmployeeDtls)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.create_res) {
          this.modalService.dismissAll();
          this.templateCreationForm.reset();
          this.profilePicUrl =
            'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg';
        } else if (res.delete_res) {
          this.singleDeleteID = null;
          this.modalService.dismissAll();
        } else if (res.error) {
          console.log(res.error);
          this.modalRef?.close('Auto-closed');
          this.templateCreationForm.reset();
          this.profilePicUrl =
            'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg';
        }
      });
  }

  opentoggle(templateName: string) {
    if (templateName == 'SingleDelete' || templateName == 'BulkDelete') {
      this.modalRef = this.modalService.open(this.confirmdelete);
    } else if (templateName == 'EditDetails' || templateName == 'AddDetails') {
      this.templateCreationForm.reset();
      this.modalRef = this.modalService.open(this.EmployeeModal);
    }
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  singleRecordDelete() {
    if (this.singleDeleteID) {
      let deletePayload = [this.singleDeleteID];
      this.store.dispatch(
        commonactions.employeeactions.deleteEmployeeData({
          payload: deletePayload,
        })
      );
    } else {
      this.paginationData.pipe(take(1)).subscribe((data) => {
        const deletePayload = data
          .filter((t) => t.isChecked === true)
          .map((m) => m.id);
        this.store.dispatch(
          commonactions.employeeactions.deleteEmployeeData({
            payload: deletePayload,
          })
        );
      });
    }
  }

  setValues(data: any) {
    this.templateCreationForm.controls['firstname'].setValue(data['firstName']);
    this.templateCreationForm.controls['lastname'].setValue(data['lastName']);
    this.templateCreationForm.controls['email'].setValue(data['email']);
    this.templateCreationForm.controls['phone'].setValue(data['contactNumber']);
    this.templateCreationForm.controls['dob'].setValue(data['dob']);
    this.templateCreationForm.controls['salary'].setValue(
      data['employee_salary']
    );
    this.templateCreationForm.controls['age'].setValue(data['employee_age']);
    this.EmployeeEdit = true;
    this.employeeID = data.id;
  }
  updateRecord() {
    let obj1 = {
      employee_name:
        this.templateCreationForm.value.firstname +
        ' ' +
        this.templateCreationForm.value.lastname,
      employee_salary: this.templateCreationForm.value.salary,
      employee_age: this.templateCreationForm.value.age,
      contactNumber: this.templateCreationForm.value.phone,
      email: this.templateCreationForm.value.email,
      dob: this.templateCreationForm.value.dob,
      profile_pic: this.profilePicUrl ? this.profilePicUrl : '',
      firstName: this.templateCreationForm.value.firstname,
      lastName: this.templateCreationForm.value.lastname,
    };

    const add_payload = { ...obj1 };
    if (this.EmployeeEdit) {
      this.apiservice.updateRecord(this.employeeID, add_payload).subscribe({
        next: (res) => {
          console.log(res);
          this.getRecords();
          this.modalRef?.close('Auto-closed');
          this.EmployeeEdit = false;
          this.templateCreationForm.reset();
          this.profilePicUrl =
            'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg';
        },
        error: (err) => {
          this.modalRef?.close('Auto-closed');
          this.EmployeeEdit = false;
          this.templateCreationForm.reset();
          this.profilePicUrl =
            'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg';

          console.log(err);
        },
      });
    } else {
      this.store.dispatch(
        commonactions.employeeactions.createEmployeeData({
          payload: add_payload,
        })
      );
    }
  }
  selectAllCheckBox(checkbox: boolean) {
    this.store.dispatch(
      commonactions.employeeactions.selectAllData({ isSelected: checkbox })
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append('profilePic', file);

    this.apiservice.uploadImage(formdata).subscribe({
      next: (res) => {
        console.log(res);
        this.profilePicUrl = res.uploadedFiles[0].imageUrl;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById(
      'add-profile-pic'
    ) as HTMLInputElement;
    fileInput.click();
  }

  searchbar(data: string) {
    this.searchdata = data;
    if (this.searchdata.length > 3) {
      this.store.dispatch(
        commonactions.employeeactions.filterEmployeeData({
          data: this.searchdata,
        })
      );
    } else if (this.searchdata === '') {
      this.store.dispatch(commonactions.employeeactions.clearFilterData());
    }
  }

  onCheck(user: any, event: boolean) {
    this.store.dispatch(
      commonactions.employeeactions.checkOrUncheckData({
        data: user,
        isSelected: event,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
