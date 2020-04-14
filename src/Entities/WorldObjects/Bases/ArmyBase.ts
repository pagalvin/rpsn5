import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";
import { ArmyBaseNames } from "../../../Data/ArmyBaseNames";

export class ArmyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Army";
    public isDecamped: boolean;

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
    
        super(args);

        this.Name = ArmyBaseNames.getArmyBaseName();
        this.isReceivingOrders = false;
        this.isDecamped = false;
    
    }

}