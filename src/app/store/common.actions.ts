import { createActionGroup, props } from '@ngrx/store';

export interface EmployeeDetails {
  id: string;
  created_time: Date | string;
  updated_time: Date | string;
  profile_pic?: string;
  firstName: string;
  lastName: string;
  employee_name: string;
  employee_age: string;
  employee_salary: string;
  email: string;
  contactNumber: string;
  age: number;
  dob: string;
  salary: number;
  address: string;
  S_No: number;
  surname: string;
  isChecked?: boolean;
}

export const employeeactions = createActionGroup({
  source: 'Employee Actions',
  events: {
    'Fetch Employee Data': props<{ pageSize: number; pageIndex: number }>(),
    'Fetch Employee Data Success': props<{ data: EmployeeDetails[] }>(),
    'Fetch Employee Data Failure': props<{ error: any }>(),
    'Create Employee Data': props<{ payload: any }>(),
    'Create Employee Data Success': props<{ data: any }>(),
    'Create Employee Data Failure': props<{ error: any }>(),
    'Update Employee Data': props<{ id: string; payload: any }>(),
    'Update Employee Data Success': props<{ data: any }>(),
    'Update Employee Data Failure': props<{ error: any }>(),
    'Delete Employee Data': props<{ payload: Array<string> }>(),
    'Delete Employee Data Success': props<{ data: any }>(),
    'Delete Employee Data Failure': props<{ error: any }>(),
    'Change Paginantion Data': props<{ pageSize: number; pageIndex: number }>(),
    'Select all Data': props<{ isSelected: boolean }>(),
    'Check or Uncheck Data': props<{
      data: EmployeeDetails;
      isSelected: boolean;
    }>(),
    'Filter Employee Data': props<{ data: string }>(),
    'Clear Filter Data': props<any>(),
  },
});
