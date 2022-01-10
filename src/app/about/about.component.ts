import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../service/config.service';
import { GameConfiguration } from '../types/game-configuration';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  get gameDefaultConfiguration(): GameConfiguration {
    return this.configService.gameDefaultConfiguration;
  }

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
  }

}
