import { Component } from '@angular/core';
import { BehaviorSubject, Observable, merge, interval } from 'rxjs';
import { mapTo, tap, scan, filter, mergeMap } from 'rxjs/operators';

/*
Objetivos:
1. não devemos mutar nenhum dado!
2. deve separar as ações que manipulam o estado dos efeitos colaterais
3. deve aumentar o contador quando clicar no botão add
4. deve subtrair o contador quando clicar no botão sub
5. deve resetar o contador quando clicar no botão reset
6. deve iniciar o contador somando um a cada segundo quando clicar no botão start ok
7. deve pausar o contador quando clicar no botão pause
*/

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

  timerEffect$ = this.actions$.pipe(
    filter(a => a == Action.Start  ),
    mergeMap(a => interval(1000)),
    mapTo(Action.Add),
    tap(console.log)
  )

  state$: Observable<AppState> = merge(
    this.actions$,
    this.timerEffect$,
  ).pipe(
    tap(a => console.log(Action[a])),
    scan((state: AppState, action) => {
      switch(action) {
        case(Action.Add):
          return {
            count: state.count + 1,
          }
        case(Action.Subtract):
          return {
            count: state.count - 1,
          }
        case(Action.Reset):
          return {...this.initialState}
      }
      return state;
    }, {...this.initialState}),
  );

}
