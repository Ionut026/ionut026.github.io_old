import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BeeType } from '../types/bee-type';
import { GameConfiguration } from '../types/game-configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private defaultConfiguration: GameConfiguration = {
    userName: '',
    beeTypesConfiguration: [
      { name: 'Queen', count: 1, healtPoints: 100, hitDamage: 8 },
      { name: 'Worker', count: 5, healtPoints: 75, hitDamage: 10 },
      { name: 'Drone', count: 8, healtPoints: 50, hitDamage: 12 }
    ]
  };

  private gameConfiguration: BehaviorSubject<GameConfiguration>;

  get $gameConfiguration(): Observable<GameConfiguration> {
    return this.gameConfiguration.asObservable();
  }

  get gameDefaultConfiguration(): GameConfiguration {
    return this.defaultConfiguration;
  }

  constructor() {
    this.defaultConfiguration.userName = localStorage.getItem('userName')??"";
    this.gameConfiguration = new BehaviorSubject<GameConfiguration>(this.defaultConfiguration);
  }

  resetConfiguration() {
    this.gameConfiguration.next(this.defaultConfiguration);
  }

  updateUserName(userName: string) {
    localStorage.setItem('userName', userName ?? "");
    this.gameConfiguration.next({ userName, beeTypesConfiguration: this.gameConfiguration.value.beeTypesConfiguration });
  }

  addBeeTypeConfiguration(beeType: BeeType) {
    let list = this.gameConfiguration.value.beeTypesConfiguration;
    if (list.length > 0 && list.some(x => x.name === beeType.name)) {
      alert("The bee name already exist and was not added.");
    }
    else {
      list.push(beeType);
    }
    this.gameConfiguration.next({ userName: this.gameConfiguration.value.userName, beeTypesConfiguration: list });
  }

  removeBeeTypeConfiguration(beeName: string) {
    this.gameConfiguration.next({
      userName: this.gameConfiguration.value.userName, beeTypesConfiguration:
        this.gameConfiguration.value.beeTypesConfiguration.filter(x => x.name != beeName)
    });
  }
}
