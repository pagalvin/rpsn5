import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class AbmBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "ABM";

    public gameYear: number = 1;

    constructor() {
        super();
    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}