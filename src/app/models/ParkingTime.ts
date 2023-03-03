export class ParkingTime{
    constructor(private _hours: number, private _minutes: number) {}

    get hours(){
        return this._hours;
    }

    get minutes(){
        return this._minutes;
    }

}