import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class MissileBase extends AbstractMilitaryBase {

    public readonly BaseType: MilitaryBaseTypeLabels = "Missile";

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}