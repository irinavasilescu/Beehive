import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValuesService {

    constructor() { }

    beeTypes = {
        queen: 'queen',
        worker: 'worker',
        drone: 'drone'
    }

    beeTypesArray = [
        this.beeTypes.queen,
        this.beeTypes.worker,
        this.beeTypes.drone
    ]

    hive = {
        [this.beeTypes.queen]: {
            total: 1,
            hp: 100,
            damage: 8
        },
        [this.beeTypes.worker]: {
            total: 5,
            hp: 75,
            damage: 10
        },
        [this.beeTypes.drone]: {
            total: 8,
            hp: 50,
            damage: 12
        }
    }
}
