import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class RadarBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Radar";
    public gameYear: number = 1;

    public modeOfOperaton: "Inactive" | "Active" | "Passive";

    constructor() {
        super();

        this.modeOfOperaton = "Inactive";

    }

    public setModeOfOperation(args: {mode: "Active" | "Passive"}) {
        this.modeOfOperaton = args.mode;
    }
}