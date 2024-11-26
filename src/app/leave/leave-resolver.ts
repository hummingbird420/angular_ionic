import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable, switchMap } from "rxjs";
import { UpdateEmployee, UpdateLeaveLedger } from "../states/user-state";

@Injectable({
    providedIn: 'root'
})
export class LeaveResolver implements Resolve<boolean> {
    constructor(private store: Store) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.dispatch(new UpdateEmployee()).pipe(
            switchMap(() => {
                return this.store.dispatch(new UpdateLeaveLedger());
            })
        )
    }
}