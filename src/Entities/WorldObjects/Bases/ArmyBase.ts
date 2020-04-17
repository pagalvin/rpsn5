import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";
import { ArmyBaseNamesFactory } from "../../../Factories/BaseNameFactories/ArmyBaseNamesFactory";

export class ArmyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Army";
    public isDecamped: boolean;

    baseNameFactory: ArmyBaseNamesFactory = ArmyBaseNamesFactory.getInstance();

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
    
        super(args);

        this.Name = this.baseNameFactory.generateBaseName({isHumanOwner: args.atLocation.myMap.owningPlayer.isHuman});
        this.isReceivingOrders = false;
        this.isDecamped = false;
    
    }

}