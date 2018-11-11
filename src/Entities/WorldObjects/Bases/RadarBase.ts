import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class RadarBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Radar";
    public gameYear: number = 1;

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}