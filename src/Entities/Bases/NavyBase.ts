import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class NavyBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "Navy";

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}