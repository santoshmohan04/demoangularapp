import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCommon from './common.reducers';

export const selectEmployeeData =
  createFeatureSelector<fromCommon.EmployeeData>('employee');

export const selectEmployeeDtls = createSelector(
  selectEmployeeData,
  fromCommon.getcommondata
);
