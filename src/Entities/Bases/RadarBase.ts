import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class RadarBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "Radar";

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}