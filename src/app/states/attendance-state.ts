import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { AttendanceService } from "../services/attendance.service";

export interface AttendenceStateModel {
    geo_location: any;
}
export class CheckPermission {
    static readonly type = '[attendance] CheckPermission';
}
export class UpdateGEOLocation {
    static readonly type = '[attendance] UpdateGEOLocation';
}
export class ResetLocation {
    static readonly type = '[attendance] ResetLocation';
}
@State<AttendenceStateModel>({
    name: 'attendance',
    defaults: {
        geo_location: {},
    },
})
@Injectable()
export class AttendenceState {
    constructor(private attService: AttendanceService) { }

    @Selector()
    static getGEOLocation(state: AttendenceStateModel): number {
        return state.geo_location;
    }

    @Action(CheckPermission)
    checkPermission(ctx: StateContext<AttendenceStateModel>) {
        return this.attService.checkAttendancePermission().pipe(tap((data: any) => {
            if (data) {
                ctx.dispatch(new UpdateGEOLocation());
            }
        }));
    }
    @Action(UpdateGEOLocation)
    updateGEOLocation(ctx: StateContext<AttendenceStateModel>) {
        return this.attService.getCurrentLocationForAttendence().pipe(tap((data: any) => {
            ctx.patchState({ geo_location: data });
        }));
    }

    @Action(ResetLocation)
    resetLocation(ctx: StateContext<AttendenceStateModel>) {
        ctx.patchState({ geo_location: {} });
    }

}