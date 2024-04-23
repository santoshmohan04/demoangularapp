import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCommon from './common.reducers';

export const selectEmployeeData =
  createFeatureSelector<fromCommon.EmployeeData>('employee');

export const selectEmployeeDtls = createSelector(
  selectEmployeeData,
  fromCommon.getcommondata
);

export const selectEmployeeList = createSelector(
  selectEmployeeData,
  fromCommon.getemployeelist
);

export const selectTotalEmployeeListCount = createSelector(
  selectEmployeeData,
  fromCommon.getemployeelistcount
);

export const selectEmpPageSize = createSelector(
  selectEmployeeData,
  fromCommon.getemppagesize
);

export const selectEmpPageIndex = createSelector(
  selectEmployeeData,
  fromCommon.getemppageindex
);
