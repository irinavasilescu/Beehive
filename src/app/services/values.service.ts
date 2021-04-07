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

    statuses = {
        healthy:  'healthy',
        warning1: 'warning1',
        warning2: 'warning2',
        sick1:    'sick1',
        sick2:    'sick2'
    }

    scenarios = {
        common: 'common',
        damaged: 'damaged'
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
            status: this.statuses.healthy
        },
        [this.beeTypes.worker]: {
            total: 5,
            hp: 75,
            damage: 10,
            img: this.images.worker,
            status: this.statuses.healthy
        },
        [this.beeTypes.drone]: {
            total: 8,
            hp: 50,
            damage: 12,
            img: this.images.drone,
            status: this.statuses.healthy
        }
    }

    beeTypesArray = Object.keys(this.hive);
}
