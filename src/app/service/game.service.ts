import { ReturnStatement, ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Bee } from '../types/bee';
import { BeeType } from '../types/bee-type';
import { GameConfiguration } from '../types/game-configuration';
import { Hit } from '../types/hit';
import { Swarm } from '../types/swarm';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly QUEEN_BEE_TYPE_NAME = "Queen";

  private swarm: BehaviorSubject<Swarm | undefined>
  private gameConfigurationSubscription: Subscription;
  private gameConfiguration: GameConfiguration | undefined;
  private gameOver: BehaviorSubject<boolean>
  private hits: BehaviorSubject<Hit[]>;

  private nextBeeIndex = 0;

  get $isGameOver(): Observable<boolean> {
    return this.gameOver.asObservable();
  }

  get $swarm(): Observable<Swarm | undefined> {
    return this.swarm.asObservable();
  }

  get $hits(): Observable<Hit[]> {
    return this.hits.asObservable();
  }

  constructor(private configService: ConfigService) {
    this.gameOver = new BehaviorSubject<boolean>(false);
    this.swarm = new BehaviorSubject<Swarm | undefined>(undefined);
    this.hits = new BehaviorSubject<Hit[]>([]);
    this.gameConfigurationSubscription = this.configService.$gameConfiguration.pipe(tap(gameConfig => {
      this.gameConfiguration = gameConfig;
      this.createSwarm();
    })).subscribe();
  }

  ngOnDestroy(): void {
    this.gameConfigurationSubscription.unsubscribe();
  }

  resetGame() {
    this.createSwarm();
    this.gameOver.next(false);
    this.hits.next([]);
  }

  createSwarm() {
    let bees: Bee[] = [];
    this.nextBeeIndex = 0;

    if (this.gameConfiguration) {
      this.gameConfiguration.beeTypesConfiguration.forEach(beeType => bees.push(...this.generateBeesForType(beeType)));
    }

    this.swarm.next({
      bees
    });
  }

  generateBeesForType(beeType: BeeType): Bee[] {
    let bees: { [id: number]: Bee } = {};

    for (let i = 0; i < beeType.count; i++) {
      bees[this.nextBeeIndex++] = { id: this.nextBeeIndex, beeType: beeType, actualHealthPoins: beeType.healtPoints } as Bee;
    }
    return Object.values(bees);
  }

  hitSwarm() {
    if (!this.gameConfiguration || this.gameConfiguration.beeTypesConfiguration.length == 0) {
      return;
    }

    let typeIndex = Math.floor(Math.random() * this.gameConfiguration.beeTypesConfiguration.length)
    let beeTypeToHit = this.gameConfiguration?.beeTypesConfiguration && this.gameConfiguration?.beeTypesConfiguration.length > 0 ?
      this.gameConfiguration?.beeTypesConfiguration[typeIndex] : undefined;
    let swarm = this.swarm.value;
    if (swarm && beeTypeToHit != undefined) {
      let foundBees = swarm.bees.filter(bee => bee.beeType.name === beeTypeToHit?.name && bee.actualHealthPoins > 0);
      if (foundBees.length > 0) {
        let newHit = { date: new Date, damagedBee: foundBees[0], healthPointBefore: foundBees[0].actualHealthPoins, healthPointAfter: NaN };
        foundBees[0].actualHealthPoins -= beeTypeToHit.hitDamage;
        if (foundBees[0].actualHealthPoins < 0) {
          foundBees[0].actualHealthPoins = 0;
          if (beeTypeToHit.name == this.QUEEN_BEE_TYPE_NAME) {
            this.gameOver.next(true);
            swarm.bees.filter(bee => bee.beeType.name != this.QUEEN_BEE_TYPE_NAME).forEach(bee => bee.actualHealthPoins = 0);
          }
        }

        newHit.healthPointAfter = foundBees[0].actualHealthPoins;
        this.addNewHit(newHit);
      }
      else {
        this.gameOver.next(true);
      }
    }
    this.swarm.next(swarm);
  }

  private addNewHit(hit: Hit) {
    let hits = this.hits.value;
    hits.push(hit);
    this.hits.next(hits);
  }

}
