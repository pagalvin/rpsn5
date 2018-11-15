import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";

export class AbmBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "ABM";

    public gameYear: number = 1;

    public totalMissiles: number;
    public isTracking: boolean;

    constructor() {
        super();

        this.totalMissiles = 0;
        this.isTracking = false;
        this.isReceivingOrders = false;
    }

}