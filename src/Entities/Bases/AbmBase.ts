import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class AbmBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "ABM";

    constructor() {
        super();
    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}