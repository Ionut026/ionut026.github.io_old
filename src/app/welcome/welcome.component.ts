import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { take, tap } from 'rxjs/operators';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  userName: string | null = '';
  private userNameSubscription: Subscription;

  constructor(public router: Router, private configService: ConfigService) {
    this.userNameSubscription = this.configService.$gameConfiguration.pipe(take(1), tap(config => this.userName = config.userName)).subscribe();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe();
  }

  onContinue() {
    this.configService.updateUserName(this.userName??"");
    this.router.navigate(['/config']);
  }

}
