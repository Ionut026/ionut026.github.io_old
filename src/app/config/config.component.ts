import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../service/config.service';
import { GameConfiguration } from '../types/game-configuration';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  get $gameConfiguration() : Observable<GameConfiguration>{
    return this.configService.$gameConfiguration;
  }  

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
  }

}
