import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";
import { AbmBaseNames } from "../../../Data/AbmBaseNames";

export class AbmBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "ABM";

    public totalMissiles: number;
    public isTracking: boolean;

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.Name = AbmBaseNames.getAbmBaseName();
        this.totalMissiles = 0;
        this.isTracking = false;
        this.isReceivingOrders = false;
    }

}