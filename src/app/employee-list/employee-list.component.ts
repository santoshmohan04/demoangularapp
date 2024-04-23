import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, Type, ViewChild, inject } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlert, NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../services/loader.service';
import { LoaderComponent } from "../loader/loader.component";
import { BrowserModule } from '@angular/platform-browser';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  providers: [ApiserviceService, LoaderService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  imports: [HttpClientModule, CommonModule, FormsModule, NgbAlert, ReactiveFormsModule, MatPaginatorModule]
})
export class EmployeeListComponent implements OnInit, OnChanges, AfterViewInit {
  employeeData: Array<any> = [];
  paginationData: any = [];
  modalRef: NgbModalRef | undefined;
  templateCreationForm!: FormGroup;
  // templateContentForm!: FormGroup;
  closeResult = '';
  singleDeleteID = '';
  disableDeleteButton: boolean = false;
  EmployeeEdit: boolean = false;
  employeeID = ''
  @Input() public showmodel!: any;
  @ViewChild('EmployeeModal') private EmployeeModal!: TemplateRef<string>;
  @ViewChild('confirmdelete') private confirmdelete!: TemplateRef<string>;
  selectAll: boolean = false;
  bulkDeleteList: any = []
  @Output() newItemEvent = new EventEmitter();
  length = 50;
  pageSize = 8;
  pageIndex = 0;
  pageSizeOptions = [8, 12, 24, 32, 48];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  @Output() paginationEvent = new EventEmitter();
  pageEvent!: PageEvent;
  profilePicUrl: any = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg'
  constructor(private fb: FormBuilder, private apiservice: ApiserviceService, config: NgbModalConfig, private modalService: NgbModal, public loader: LoaderService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }



  ngOnInit() {
    this.getRecords();
    this.loader.show();
    this.templateCreationForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)]], // Phone number regex validation
      dob: [null, [Validators.required, this.pastDateValidator()]], // Past date validation for DOB
      salary: [null, [Validators.min(100)]], // Minimum salary validation
      age: [null, [Validators.required, Validators.min(18), Validators.max(99)]] // Age range validation
    });
    this.showmodel[0] = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.showmodel);

    if (this.showmodel[0]) {
      const modalRef = this.showmodel[1] === "EmployeeModal" ? this.EmployeeModal : this.confirmdelete;
      const mode = this.showmodel[1] === "EmployeeModal" ? 'AddDetails' : 'BulkDelete';
      this.opentoggle(modalRef, mode);
    }
  }
  ngAfterViewInit(): void {
    this.pagination({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e || this.pageEvent;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.pagination(e)
  }
  pagination(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    console.log('start index', startIndex);

    let endIndex = startIndex + event.pageSize;
    endIndex = this.employeeData.length < endIndex ? this.employeeData.length : endIndex;
    this.paginationData = this.employeeData.slice(startIndex, endIndex);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
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
    this.apiservice.getRecords().subscribe({
      next: (res) => {
        res = res.filter((user: any) => {
          if (
            user.firstName &&
            user.lastName &&
            user.employee_age &&
            user.employee_salary &&
            user.email &&
            user.contactNumber &&
            user.dob
          ) {
            user['isChecked'] = false;
            return user;
          }
        });
        this.employeeData = res;
        this.length = this.employeeData.length;
        this.pagination({ pageIndex: this.pageIndex, pageSize: this.pageSize });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  opentoggle(content: TemplateRef<any>, templateName: string) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result: any) => {
        if (templateName == 'SingleDelete') {
          console.log(this.singleDeleteID);
        }
        else if (templateName == 'EditDetails') {
          this.templateCreationForm.reset();
        }
        else if (templateName == "AddDetails") {
          this.showmodel[0] = false;
          this.newItemEvent.emit({ closeModel: true });
        }
        else if (templateName == "BulkDelete") {
          this.showmodel[0] = false;
          this.newItemEvent.emit({ closeModel: true });
        }
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
      },
      (reason: any) => {
        if (templateName == 'SingleDelete') {
          this.singleDeleteID = '';
        } else if (templateName == 'EditDetails') {
          this.templateCreationForm.reset();
        }
        else if (templateName == "AddDetails") {
          this.showmodel[0] = false;
          this.newItemEvent.emit({ closeModel: true });
        } else if (templateName == "BulkDelete") {
          this.showmodel[0] = false;
          this.newItemEvent.emit({ closeModel: true });
        }
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.newItemEvent.emit({ closeModel: true });
        console.log(this.closeResult);
      },

    );
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


  singleRecordDelete(id: any) {
    this.disableDeleteButton = true;
    if (this.bulkDeleteList.length > 0) {
      this.apiservice.deleteAllRecords(this.bulkDeleteList[0], this.bulkDeleteList).subscribe({
        next: (res) => {
          console.log(res)
          this.getRecords();
          this.modalRef?.close('Auto-closed');
          this.disableDeleteButton = false;
          this.bulkDeleteList = []
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.apiservice.deleteSingleRecords(id).subscribe({
        next: (res) => {
          console.log(res)
          this.getRecords();
          this.modalRef?.close('Auto-closed');
          this.disableDeleteButton = false;
          this.bulkDeleteList = []
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  bulkDelete(event: any, selectedItemsList: Array<string>) {
    const isChecked = event.target.checked;
    console.log('selectedItemsList :', selectedItemsList);
    // this.paginationData.find((obj: any) => obj.id === selectedItemsList)?.isChecked = isChecked;
    const itemToUpdate = this.paginationData.find((obj: any) => obj.id === selectedItemsList);
    if (itemToUpdate) {
      itemToUpdate.isChecked = isChecked;
    }
    console.log(this.paginationData);

    if (isChecked) {
      this.bulkDeleteList.push(selectedItemsList)
    } else {
      this.bulkDeleteList = this.bulkDeleteList.filter((item: any) => item !== selectedItemsList);
    }

    if (this.bulkDeleteList.length === this.paginationData.length && isChecked) {
      this.selectAll = this.bulkDeleteList.length === this.paginationData.length;
    }
    else if (this.bulkDeleteList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }


    // if (this.bulkDeleteList.length !== this.paginationData.length && isChecked) this.selectAll = true;
    // else if (this.bulkDeleteList.length === 0 && !isChecked) this.selectAll = false;
    this.newItemEvent.emit({
      selectAll: this.selectAll, count: this.bulkDeleteList.length, deletebtn: this.bulkDeleteList.length ? true : false
    });

    console.log(event, isChecked, selectedItemsList, this.selectAll, this.bulkDeleteList, this.bulkDeleteList.length ? true : false);

  }



  setValues(data: any) {
    this.templateCreationForm.controls['firstname'].setValue(data['firstName']);
    this.templateCreationForm.controls['lastname'].setValue(data['lastName']);
    this.templateCreationForm.controls['email'].setValue(data['email']);
    this.templateCreationForm.controls['phone'].setValue(data['contactNumber']);
    this.templateCreationForm.controls['dob'].setValue(data['dob']);
    this.templateCreationForm.controls['salary'].setValue(data['employee_salary']);
    this.templateCreationForm.controls['age'].setValue(data['employee_age']);
    this.EmployeeEdit = true;
    this.employeeID = data.id
  }
  updateRecord() {

    let obj1 = {
      employee_name: this.templateCreationForm.value.firstname + " " + this.templateCreationForm.value.lastname,
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
          console.log(res)
          this.getRecords();
          this.modalRef?.close('Auto-closed');
          this.EmployeeEdit = false;
          this.templateCreationForm.reset();
          this.profilePicUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg'

        },
        error: (err) => {
          this.modalRef?.close('Auto-closed');
          this.EmployeeEdit = false;
          this.templateCreationForm.reset();
          this.profilePicUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg'

          console.log(err);
        },
      });
    }
    else {
      this.apiservice.addRecord(add_payload).subscribe({
        next: (res) => {
          console.log(res)
          this.getRecords();
          this.modalRef?.close('Auto-closed');
          this.templateCreationForm.reset();
          this.profilePicUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg'

        },
        error: (err) => {
          this.modalRef?.close('Auto-closed');
          this.templateCreationForm.reset();
          this.profilePicUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg'
          console.log(err);
        },
      });
    }

  }
  selectAllCheckBox(checkbox: any) {
    console.log(checkbox);
    if (!checkbox) {
      this.selectAll = false;
      this.bulkDeleteList = this.paginationData
        .filter((item: any) => item.id) // Filter to remove items with falsy id values
        .map((item: any) => item.id);
    }
    else {
      this.selectAll = true;
      this.bulkDeleteList = []
    }
    this.paginationData.forEach((element: any) => {
      element.isChecked = !checkbox;
    });
    console.log(this.bulkDeleteList);
    this.newItemEvent.emit({
      selectAll: this.selectAll, count: this.bulkDeleteList.length, deletebtn: this.bulkDeleteList.length ? true : false
    });

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append("profilePic", file);

    this.apiservice.uploadImage(formdata).subscribe({
      next: (res) => {
        console.log(res)
        this.profilePicUrl = res.uploadedFiles[0].imageUrl;

      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  triggerFileInput() {
    const fileInput = document.getElementById('add-profile-pic') as HTMLInputElement;
    fileInput.click();
  }
  searchbar(event: any) {
    console.log(event);

    const filter = event.toUpperCase();
    let found = false;
    let stable: any = [];
    this.employeeData.forEach((i, j) => {
      if (filter && i.employee_name.toUpperCase().indexOf(filter) > -1) {
        stable.push(i);
        found = true;
      }
    });
    console.log(stable);

    if (found) {
      //this.paginationData = stable;
      this.employeeData = stable;
      this.length = this.employeeData.length;
      this.pagination({ pageIndex: 0, pageSize: this.pageSize });
    } else {
      if (filter) {
        console.log('filter');

        this.employeeData = [];
        this.length = this.employeeData.length;
        this.pagination({ pageIndex: 0, pageSize: this.pageSize });
      } else {
        this.getRecords();
      }
    }
  }

}
