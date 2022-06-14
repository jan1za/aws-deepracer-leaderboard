import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {

  public timerRef: any;

  constructor(private http: HttpClient) { }

  public leaders: { name: any; time: string; team: string }[] = [
    
  ];
  ngOnInit(): void {
    if (this.timerRef != null) {
      clearInterval(this.timerRef);
    }
    this.configureInterval();
  }

  ngOnDestroy() {
     clearInterval(this.timerRef);
  }

  public configureInterval() {
    this.getRacers();
    this.timerRef = setInterval(() => {
      this.getRacers();
    }, 5000);
  }

  private getRacers() {
    this.http.get('[ENDPOINT-HERE]').subscribe((res: any) => {
      console.log(res);
      if (res.data != undefined && res.data.length > 0) {
        const tmp: { name: any; time: string; team: string}[] = [];
        res.data.forEach((e: { name: any; time: number; team: string}) => {
          if (e.time > 0 && e.time < 9999999) {
            console.log('pushing');
            tmp.push({ name: e.name, time: this.getTime(e.time), team: e.team });
          }
        });
        this.leaders = tmp;
      } else {
        this.leaders = [];
      }
    });
  }

  public getTime(val: number): string {
    return moment.utc(val).format('mm:ss.SSS');
  }
}
