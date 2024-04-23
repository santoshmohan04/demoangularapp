import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import * as commonactions from './common.actions';
import { ApiService } from '../services/apiservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

@Injectable()
export class CommonEffects {
  constructor(
    private actions$: Actions,
    private apiservice: ApiService,
    private readonly store: Store
  ) {}

  fetchEmployeeData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commonactions.employeeactions.fetchEmployeeData),
      exhaustMap(() =>
        this.apiservice.getRecords().pipe(
          map((response: commonactions.EmployeeDetails[]) => {
            const employeerecords = response.filter((user: any) => {
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
            return commonactions.employeeactions.fetchEmployeeDataSuccess({
              data: employeerecords,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              commonactions.employeeactions.fetchEmployeeDataFailure({
                error: error,
              })
            )
          )
        )
      )
    );
  });

  createEmployeeData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commonactions.employeeactions.createEmployeeData),
      exhaustMap((action) =>
        this.apiservice.addRecord(action.payload).pipe(
          map((response: any) => {
            return commonactions.employeeactions.createEmployeeDataSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              commonactions.employeeactions.createEmployeeDataFailure({
                error: error,
              })
            )
          )
        )
      )
    );
  });

  getRecordsOnCreate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commonactions.employeeactions.createEmployeeDataSuccess),
      map((action) => {
        return commonactions.employeeactions.fetchEmployeeData();
      })
    );
  });

  updateEmployeeData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commonactions.employeeactions.updateEmployeeData),
      exhaustMap((action) =>
        this.apiservice.updateRecord(action.id, action.payload).pipe(
          map((response: any) => {
            return commonactions.employeeactions.updateEmployeeDataSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              commonactions.employeeactions.updateEmployeeDataFailure({
                error: error,
              })
            )
          )
        )
      )
    );
  });

  deleteEmployeeData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commonactions.employeeactions.deleteEmployeeData),
      exhaustMap((action) =>
        this.apiservice.deleteSingleRecords(action.payload).pipe(
          map((response: any) => {
            return commonactions.employeeactions.deleteEmployeeDataSuccess({
              data: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              commonactions.employeeactions.deleteEmployeeDataFailure({
                error: error,
              })
            )
          )
        )
      )
    );
  });
}
