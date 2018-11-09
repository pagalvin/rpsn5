import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class ArmyBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "Army";
    public gameYear: number = 1;

    constructor() {
        super();
    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}