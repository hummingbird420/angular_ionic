import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { DashboardService } from '../services/dashboard.service';
import { map, tap } from 'rxjs';

export interface DashboardStateModel {
  menu: any;
}

export class UpdateMenu {
  static readonly type = '[dashboard] Store Menu';
}
export class UpdateMenuReset {
  static readonly type = '[dashboard] UpdateMenuReset';
}
@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    menu: {},
  },
})
@Injectable()
export class DashboardState {
  constructor(private dashboardService: DashboardService) { }

  @Selector()
  static getMenus(state: DashboardStateModel): number {
    return state.menu;
  }

  @Action(UpdateMenu)
  updateMenu(ctx: StateContext<DashboardStateModel>) {
    return this.dashboardService.getMenuInfo().pipe(tap((data: any) => {
      ctx.patchState({ menu: data });
    }));
  }
  @Action(UpdateMenuReset)
  updateMenuReset(ctx: StateContext<DashboardStateModel>) {
    ctx.patchState({ menu: {} });
  }
}
