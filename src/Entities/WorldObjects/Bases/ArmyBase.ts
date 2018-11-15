import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class ArmyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Army";
    public gameYear: number = 1;
    public isDecamped: boolean;

    constructor() {
        super();

        this.isReceivingOrders = false;
        this.isDecamped = false;
    }

    // public activate(): void {
    //     throw ("Not yet implemented.");
    // }

}