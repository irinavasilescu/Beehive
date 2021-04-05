import { Component, OnInit } from '@angular/core';
import { ValuesService } from './../../services/values.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    bees: any = [];

    constructor(
        private readonly valuesService: ValuesService
    ) { }

    ngOnInit(): void {
        this.initBeesState();
    }

    initBeesState() {
        this.valuesService.beeTypesArray.forEach(beeType => {
            for (let i; i <= this.valuesService.hive[beeType].total; i++) {
                this.bees.push(this.valuesService.hive[beeType])
            }
        })
        console.log('bees', this.bees);
    }
}
