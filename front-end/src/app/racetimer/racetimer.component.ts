import { ReturnStatement } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Component({
  selector: 'app-racetimer',
  templateUrl: './racetimer.component.html',
  styleUrls: ['./racetimer.component.scss']
})
export class RacetimerComponent implements OnInit, OnDestroy {

  public now = new Date().getTime();
  public isRunning = false;
  public counter: number = 0;
  public totalcounter: number = 0;
  public timerRef: any;
  public totalTimerRef: any = null;
  public running: boolean = false;
  public startText = 'Start Race';
  public laptimes: any[] = [];
  public bestTime: number = 0;
  public racerSelected: any = undefined;
  public racers: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getRacers();
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
    clearInterval(this.totalTimerRef);
  }

  private dynamicSort(property: string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: any,b: any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  private resetTimer(): void {
    this.running = false;
    this.startText = 'Start Race';
    this.counter = 0;
    if (this.timerRef != null) {
      clearInterval(this.timerRef);
    }
  }

  private startTotalTimer(): void {
    if (this.totalTimerRef == null) {
      const startTimeTmp = Date.now() - (this.totalcounter || 0);
      this.totalTimerRef = setInterval(() => {
        this.totalcounter = Date.now() - startTimeTmp;
      });
    }
  }

  private resetTotalTimer(): void {
    this.totalcounter = 0;
    if (this.totalTimerRef != null) {
      clearInterval(this.totalTimerRef);
    }
    this.totalTimerRef = null;
  }


  private startTimer(): void {
    this.startText = 'Pause Timer';
    this.running = true;
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });
    this.startTotalTimer();
  }

  private pauseTimer(): void {
    this.running = false;
    this.startText = 'Resume Timer';
    clearInterval(this.timerRef);
  }

  onStart(): void {
    if (!this.running) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  onSave(): void {
    console.log('Submitting');
    const body = JSON.stringify({
      "name": this.racerSelected.name,
      "time":  this.bestTime
    });
    console.log(body);
    var result = this.http.post('[ENDPOINT-HERE]', body, {}).subscribe((res: any) => {
      this.onClear();
      this.getRacers();
    });
  }
  onComplete(): void {
    if (this.counter > 0) {
      var now = this.counter;
      this.resetTimer();
      this.startTimer();
      if (this.bestTime == 0) {
        this.bestTime = now;
      }
      else if (this.bestTime > now) {
        this.bestTime = now;
      }
      const new_rec = { 'time': moment.utc(now).format('mm:ss.SSS') , 'val': now};
      this.laptimes.push(new_rec);
    }
  }

  onClear(): void {
    this.laptimes = [];
    this.bestTime = 0;
    this.racerSelected = undefined;
    this.resetTimer();
    this.resetTotalTimer();
  }

  getTime(): String {
    return moment.utc(this.counter).format('mm:ss.SSS');
  }
  
  getTotalTime(): String {
    return moment.utc(this.totalcounter).format('mm:ss.SSS');
  }

  getBestTime(): String {
    if (this.bestTime == 0) {
      return 'Not Set';
    } else {
      return moment.utc(this.bestTime).format('mm:ss.SSS');
    }
  }

  getRacerName(): String {
    if (this.racerSelected != undefined && this.racerSelected.name != undefined) {
      return this.racerSelected.name;
    } else {
      return "-";
    }
  }
  

  private getRacers() {
    this.http.get('[ENDPOINT-HERE]').subscribe((res: any) => {
      this.racers = res.data.sort(this.dynamicSort("name"));
    });
  }

  public updateBestTime(event: any) {
    this.laptimes = [];
    this.bestTime = 0;
    this.resetTimer();
    if (this.racerSelected != undefined && this.racerSelected.name != undefined) {
      this.bestTime = this.racerSelected.time;
    }
  }

  public onDeleteRec(i: number) {
    this.laptimes.splice(i, 1);
    var t = this.racerSelected.time;
    this.laptimes.forEach((v) => { 
      if (v.val < t) {
        t = v.val;
      }
    });
    this.bestTime = t;

  }


  public onResetTimer() {
    this.pauseTimer();
    this.counter = 0;
  }

}
