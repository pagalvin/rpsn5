import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class NavyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";
    public gameYear: number = 1;

    constructor() {
        super();

    }

    public activate(): void {
        throw ("Not yet implemented.");
    }

}