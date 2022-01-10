import { BeeType } from "./bee-type";

export interface Bee {
    id: number;
    beeType: BeeType;
    actualHealthPoins: number;
}