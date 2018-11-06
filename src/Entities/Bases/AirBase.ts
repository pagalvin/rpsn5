import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class AirBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "Air";

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}