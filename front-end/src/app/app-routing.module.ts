import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RacetimerComponent } from './racetimer/racetimer.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'racertimer', component: RacetimerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
