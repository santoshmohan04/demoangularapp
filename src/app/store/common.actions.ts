import { createActionGroup, props } from '@ngrx/store';

export interface EmployeeDetails {
  id: string;
  created_time: Date | string;
  updated_time: Date | string;
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
}

export const employeeactions = createActionGroup({
  source: 'Employee Actions',
  events: {
    'Fetch Employee Data': props<any>(),
    'Fetch Employee Data Success': props<{ data: EmployeeDetails[] }>(),
    'Fetch Employee Data Failure': props<{ error: any }>(),
    'Create Employee Data': props<{ payload: any }>(),
    'Create Employee Data Success': props<{ data: any }>(),
    'Create Employee Data Failure': props<{ error: any }>(),
    'Update Employee Data': props<{ id: string; payload: any }>(),
    'Update Employee Data Success': props<{ data: any }>(),
    'Update Employee Data Failure': props<{ error: any }>(),
    'Delete Employee Data': props<{ id: string; payload?: any }>(),
    'Delete Employee Data Success': props<{ data: any }>(),
    'Delete Employee Data Failure': props<{ error: any }>(),
  },
});
