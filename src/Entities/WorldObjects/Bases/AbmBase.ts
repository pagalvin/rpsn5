import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";

export class AbmBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "ABM";

    public gameYear: number = 1;

    public totalMissiles: number;
    public isTracking: boolean;

    constructor(args: {atLocation: MapLocation}) {
        super(args);

        this.totalMissiles = 0;
        this.isTracking = false;
        this.isReceivingOrders = false;
    }

}