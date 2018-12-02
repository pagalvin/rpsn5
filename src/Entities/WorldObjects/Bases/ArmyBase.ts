import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";

export class ArmyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Army";
    public isDecamped: boolean;

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
    
        super(args);

        this.isReceivingOrders = false;
        this.isDecamped = false;
    
    }

    // public activate(): void {
    //     throw ("Not yet implemented.");
    // }

}