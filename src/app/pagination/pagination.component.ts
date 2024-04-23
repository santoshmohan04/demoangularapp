import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AfterContentInit } from '@angular/core';
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements AfterContentInit {
  @Input() public pageData!: any;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  @Output() paginationEvent = new EventEmitter();
  pageEvent!: PageEvent;
  paginationData: any = [];

  ngAfterContentInit(): void {
    this.length = this.pageData.length;
    console.log(this.length);
    // this.handlePageEvent();
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(e);
    this.pagination(e)
  }
  pagination(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginationData = this.pageData.slice(startIndex, endIndex);
    this.paginationEvent.emit(this.paginationData);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}


