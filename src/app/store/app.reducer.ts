import { ActionReducerMap } from '@ngrx/store';
import * as fromCommon from './common.reducers';

export interface AppState {
  employee: fromCommon.EmployeeData;
}

export const appReducer: ActionReducerMap<AppState> = {
  employee: fromCommon.emplyeereducer,
};
