import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../service/config.service';
import { GameService } from '../service/game.service';
import { GameConfiguration } from '../types/game-configuration';
import { Hit } from '../types/hit';
import { Swarm } from '../types/swarm';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  get $swarm(): Observable<Swarm | undefined> {
    return this.gameService.$swarm;
  }

  get $hits(): Observable<Hit[]> {
    return this.gameService.$hits;
  }

  get $isGameOver(): Observable<boolean> {
    return this.gameService.$isGameOver;
  }

  get $gameConfiguration(): Observable<GameConfiguration> {
    return this.configService.$gameConfiguration;
  }

  constructor(private configService: ConfigService, private gameService: GameService) { }

  ngOnInit(): void {
    this.resetGame();
  }

  hitSwarm() {
    this.gameService.hitSwarm();
  }

  resetGame() {
    this.gameService.resetGame();
  }

}
