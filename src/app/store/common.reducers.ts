import { Action, createReducer, on } from '@ngrx/store';
import * as commonActions from './common.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface EmployeeData {
  records: commonActions.EmployeeDetails[];
  create_res: any;
  update_res: any;
  delete_res: any;
  error: HttpErrorResponse;
}

export const initialEmployeeData = {
  records: [],
  create_res: null,
  update_res: null,
  delete_res: null,
  error: null,
};

const employeereducer = createReducer(
  initialEmployeeData,
  on(
    commonActions.employeeactions.fetchEmployeeDataSuccess,
    (state, { data }): EmployeeData => ({
      ...state,
      records: data,
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
    create_res: state.create_res,
    update_res: state.update_res,
    delete_res: state.delete_res,
    error: state.error,
  };
};
