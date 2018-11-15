import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class NavyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";
    public gameYear: number = 1;

    public totalSubMissiles: number;
    public didLaunchMissles: boolean;

    constructor() {
        super();
        this.totalSubMissiles = 0;
        this.didLaunchMissles = false;
        this.isReceivingOrders = false;
    }

    public activate(){}

}