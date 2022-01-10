import { Bee } from "./bee";

export interface Hit {
    date: Date;
    damagedBee: Bee;
    healthPointBefore: number;
    healthPointAfter: number;
}