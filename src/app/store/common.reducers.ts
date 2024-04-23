import { Action, createReducer, on } from '@ngrx/store';
import * as commonActions from './common.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface EmployeeData {
  records: commonActions.EmployeeDetails[];
  paginationdata: commonActions.EmployeeDetails[];
  count: number;
  pageSize: number;
  pageIndex: number;
  create_res: any;
  update_res: any;
  delete_res: any;
  error: HttpErrorResponse;
}

export const initialEmployeeData = {
  records: [],
  paginationdata: [],
  count: 0,
  pageSize: 8,
  pageIndex: 0,
  create_res: null,
  update_res: null,
  delete_res: null,
  error: null,
};

const pagination = (data: any) => {
  const startIndex = data.pageIndex * data.pageSize;
  let endIndex = startIndex + data.pageSize;
  endIndex = data.count < endIndex ? data.count : endIndex;
  return data.list.slice(startIndex, endIndex);
};

const checkUncheckAllData = (data: any, action: boolean) => {
  const emplist = JSON.parse(JSON.stringify(data));
  emplist.forEach((t) => (t.isChecked = action));
  return emplist;
};

const checkUncheckData = (data: any, list: any, action: boolean) => {
  const emplist = JSON.parse(JSON.stringify(list));
  emplist.find((t) => t.id === data.id).isChecked = action;
  return emplist;
};

const datafilter = (items: commonActions.EmployeeDetails[], term: string) => {
  const toCompare = term.toLowerCase();
  const filtereddata = [];
  items.forEach((t) => {
    if (toCompare && t.employee_name.toLowerCase().indexOf(toCompare) > -1) {
      filtereddata.push(t);
    }
  });
  return filtereddata;
};

const employeereducer = createReducer(
  initialEmployeeData,
  on(
    commonActions.employeeactions.fetchEmployeeData,
    (state, { pageIndex, pageSize }): EmployeeData => ({
      ...state,
      pageSize: pageSize,
      pageIndex: pageIndex,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: null,
    })
  ),
  on(
    commonActions.employeeactions.fetchEmployeeDataSuccess,
    (state, { data }): EmployeeData => ({
      ...state,
      records: data,
      paginationdata: pagination({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        count: data.length,
        list: data,
      }),
      count: data.length,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: null,
    })
  ),
  on(
    commonActions.employeeactions.fetchEmployeeDataFailure,
    (state, { error }): EmployeeData => ({
      ...state,
      records: null,
      count: 0,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: error,
    })
  ),
  on(
    commonActions.employeeactions.createEmployeeDataSuccess,
    (state, { data }): EmployeeData => ({
      ...state,
      records: null,
      create_res: data,
      update_res: null,
      delete_res: null,
      error: null,
    })
  ),
  on(
    commonActions.employeeactions.createEmployeeDataFailure,
    (state, { error }): EmployeeData => ({
      ...state,
      records: null,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: error,
    })
  ),
  on(
    commonActions.employeeactions.updateEmployeeDataSuccess,
    (state, { data }): EmployeeData => ({
      ...state,
      records: null,
      create_res: null,
      update_res: data,
      delete_res: null,
      error: null,
    })
  ),
  on(
    commonActions.employeeactions.updateEmployeeDataFailure,
    (state, { error }): EmployeeData => ({
      ...state,
      records: null,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: error,
    })
  ),
  on(
    commonActions.employeeactions.deleteEmployeeDataSuccess,
    (state, { data }): EmployeeData => ({
      ...state,
      records: null,
      create_res: null,
      update_res: null,
      delete_res: data,
      error: null,
    })
  ),
  on(
    commonActions.employeeactions.deleteEmployeeDataFailure,
    (state, { error }): EmployeeData => ({
      ...state,
      records: null,
      create_res: null,
      update_res: null,
      delete_res: null,
      error: error,
    })
  ),
  on(
    commonActions.employeeactions.changePaginantionData,
    (state, { pageIndex, pageSize }): EmployeeData => ({
      ...state,
      pageIndex: pageIndex,
      pageSize: pageSize,
      paginationdata: pagination({
        pageIndex: pageIndex,
        pageSize: pageSize,
        count: state.count,
        list: state.records,
      }),
    })
  ),
  on(
    commonActions.employeeactions.selectAllData,
    (state, { isSelected }): EmployeeData => ({
      ...state,
      paginationdata: pagination({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        count: state.count,
        list: checkUncheckAllData(state.paginationdata, isSelected),
      }),
    })
  ),
  on(
    commonActions.employeeactions.checkOrUncheckData,
    (state, { data, isSelected }): EmployeeData => ({
      ...state,
      paginationdata: checkUncheckData(data, state.paginationdata, isSelected),
    })
  ),
  on(
    commonActions.employeeactions.filterEmployeeData,
    (state, { data }): EmployeeData => ({
      ...state,
      paginationdata: pagination({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        count: state.count,
        list: datafilter(state.records, data),
      }),
      count: datafilter(state.records, data).length,
    })
  ),
  on(
    commonActions.employeeactions.clearFilterData,
    (state): EmployeeData => ({
      ...state,
      paginationdata: pagination({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        count: state.records.length,
        list: state.records,
      }),
      count: state.records.length,
    })
  )
);

export function emplyeereducer(
  state: EmployeeData | undefined,
  action: Action
) {
  return employeereducer(state, action);
}

export const getcommondata = (state: EmployeeData) => {
  return {
    records: state.records,
    count: state.count,
    create_res: state.create_res,
    update_res: state.update_res,
    delete_res: state.delete_res,
    error: state.error,
  };
};

export const getemployeelist = (state: EmployeeData) => {
  return state.paginationdata;
};

export const getemployeelistcount = (state: EmployeeData) => {
  return state.count;
};

export const getemppagesize = (state: EmployeeData) => {
  return state.pageSize;
};

export const getemppageindex = (state: EmployeeData) => {
  return state.pageIndex;
};
