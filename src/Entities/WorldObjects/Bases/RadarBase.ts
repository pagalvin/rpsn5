import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";

export class RadarBase extends AbstractMilitaryBase {
 
    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Radar";
    public gameYear: number = 1;

    public modeOfOperation: "Inactive" | "Active" | "Passive";

    constructor(args: {atLocation: MapLocation}) {
        super(args);

        this.modeOfOperation = "Inactive";
    }

    public setModeOfOperation(args: {mode: "Active" | "Passive"}) {
        this.modeOfOperation = args.mode;
    }
}