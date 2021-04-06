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

    images = {
        queen:  './assets/queen.png',
        worker: './assets/worker.png',
        drone:  './assets/drone.png',
        hive:   './assets/hive.png'
    }

    hive = {
        [this.beeTypes.queen]: {
            total: 1,
            hp: 100,
            damage: 8,
            img: this.images.queen,
            status: 'healthy'
        },
        [this.beeTypes.worker]: {
            total: 5,
            hp: 75,
            damage: 10,
            img: this.images.worker,
            status: 'healthy'
        },
        [this.beeTypes.drone]: {
            total: 8,
            hp: 50,
            damage: 12,
            img: this.images.drone,
            status: 'healthy'
        }
    }

    beeTypesArray = Object.keys(this.hive);

    scenarios = {
        common: 'common',
        damaged: 'damaged'
    }
}
