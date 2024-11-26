
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { LeaveService } from '../services/leave.service';
import { of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';


export interface AppStateModel {
  users: any;
  header: string;
  isNewButton: boolean,
  newButtonLink: string,
  employee: any,
  leaveLedger: any[]
}


export class UpdateHeader {
  static readonly type = '[dashboard] UpdateHeader';
  constructor(public header: string = '', public isNewButton: boolean = false, public newButtonLink = '') { }
}
export class SetUser {
  static readonly type = '[user_state] SetUser';
  constructor(public user: any) { }
}
export class UpdateEmployee {
  static readonly type = '[dashboard] UpdateEmployee';
}
export class UpdateLeaveLedger {
  static readonly type = '[dashboard] UpdateLeaveLedger';

}
export class UpdateLogout {
  static readonly type = '[user_state] UpdateLogout';
}
@State<AppStateModel>({
  name: 'user_state',
  defaults: {
    users: {},
    header: 'Dashboard',
    isNewButton: false,
    newButtonLink: '',
    employee: {},
    leaveLedger: []
  }
})
@Injectable()
export class UserState {
  constructor(private leaveService: LeaveService) { }
  @Selector()
  static getUsers(state: AppStateModel): any {
    return state.users;
  }
  @Selector()
  static getHeaders(state: AppStateModel): any {
    return { 'header': state.header, 'isNewButton': state.isNewButton, 'newButtonLink': state.newButtonLink };
  }
  @Selector()
  static getEmployee(state: AppStateModel): any {
    return state.employee;
  }
  @Selector()
  static getLeaveLedger(state: AppStateModel): any {
    return state.leaveLedger;
  }


  /******************************Action************************* */
  @Action(SetUser)
  setUsers(ctx: StateContext<AppStateModel>, action: any) {
    ctx.patchState({ users: action });

  }
  @Action(UpdateHeader)
  updateHeader(ctx: StateContext<AppStateModel>, action: AppStateModel) {
    ctx.patchState({ header: action.header, isNewButton: action.isNewButton, newButtonLink: action.newButtonLink });
  }
  @Action(UpdateEmployee)
  updateEmployee(ctx: StateContext<AppStateModel>) {
    return this.leaveService.getEmployeeForSelfService().pipe(
      switchMap((res: any) => {
        ctx.patchState({
          employee: res
        });
        return of(res);
      })
    );
  }
  @Action(UpdateLeaveLedger)
  updateLeaveLedger(ctx: StateContext<AppStateModel>) {
    let preData = ctx.getState().employee?.employee_id;
    return this.leaveService.getEmployeeLeaveLedger(preData).pipe(
      switchMap((res: any) => {
        ctx.patchState({
          leaveLedger: res
        });
        return of(res);
      })
    );
  }

  @Action(UpdateLogout)
  updateLogout(ctx: StateContext<AppStateModel>) {
    ctx.patchState({
      users: {},
      header: 'Dashboard',
      isNewButton: false,
      newButtonLink: '',
      employee: {},
      leaveLedger: []
    });
  }
}



