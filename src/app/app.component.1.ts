import { Component } from '@angular/core';
import { BehaviorSubject, merge, interval, NEVER, Observable, defer } from 'rxjs';
import { mapTo, startWith, scan, pluck, distinctUntilChanged, map, switchMap, tap, withLatestFrom, shareReplay, filter, mergeMap } from 'rxjs/operators';

enum Action {
  Start,
  Pause,
  Reset,
  Add,
  Subtract,
}

interface AppState {
  count: number,
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  private initialState: AppState = {
    count: 0,
  };

  actionType = Action;
  actions$ = new BehaviorSubject(Action.Reset);

  state$: Observable<AppState> = merge(
    this.actions$,
    defer(() => this.timerCount$),
  ).pipe(
    scan((state: AppState, action: Action) => {
      switch (action) {
        case Action.Add:
          return { ...state, count: state.count + 1 };
      }
      return state;
    }, {...this.initialState}),
  );

  timerCount$ = this.actions$.pipe(
    filter(action => action === Action.Start),
    switchMap(() => interval(1000)),
    map(() => Action.Add),
  )

}
