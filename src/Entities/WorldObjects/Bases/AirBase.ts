import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Constants } from "../../../Game/constants";
import { Rng } from "../../../Utils/Rng";

export class AirBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Air";
    public gameYear: number = 1;

    public totalBombers: number;
    public totalFighters: number;

    public isFlying: boolean;

    constructor() {
        super();

        this.totalBombers = 0;
        this.totalFighters = 0;
        this.isFlying = false;
    }

    public activate(): void {
        this.isReceivingOrders = true;

        this.totalBombers = Constants.MAX_INITIAL_BOMBERS + Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_BOMBERS -1});
        this.totalFighters = Constants.MAX_INITIAL_FIGHTERS + Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_FIGHTERS -1});
        
    }



}