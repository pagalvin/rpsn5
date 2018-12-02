import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";

export class RadarBase extends AbstractMilitaryBase {
 
    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Radar";

    public modeOfOperation: "Inactive" | "Active" | "Passive";

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.modeOfOperation = "Inactive";
    }

    public setModeOfOperation(args: {mode: "Active" | "Passive"}) {
        this.modeOfOperation = args.mode;
    }
}