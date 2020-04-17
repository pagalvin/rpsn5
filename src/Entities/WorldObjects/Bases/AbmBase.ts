import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";
import { AbmBaseNameFactory } from "../../../Factories/BaseNameFactories/AbmBaseNameFactory";

export class AbmBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "ABM";

    public totalMissiles: number;
    public isTracking: boolean;

    baseNameFactory = AbmBaseNameFactory.getInstance();

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.Name = this.baseNameFactory.generateBaseName({isHumanOwner: args.atLocation.myMap.owningPlayer.isHuman});
        this.totalMissiles = 0;
        this.isTracking = false;
        this.isReceivingOrders = false;
    }

}