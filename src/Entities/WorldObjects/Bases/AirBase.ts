import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Constants } from "../../../Game/constants";
import { Rng } from "../../../Utils/Rng";
import { Ordnance } from "../../Ordnance";
import { GameLogic } from "../../../Game/GameLogic";

export class AirBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Air";
    public gameYear: number = 1;

    public ordnance: Ordnance[];
    public totalFighters: number;

    public isFlying: boolean;

    constructor() {
        super();

        this.ordnance = [];
        this.totalFighters = 0;
        this.isFlying = false;
    }

    public activate(): void {

        console.log(`AirBase.ts: activate: entering.`);
        
        GameLogic.activateAirBase({forBase: this});

        // this.isReceivingOrders = true;

        // // this.ordnance = Constants.MAX_INITIAL_BOMBERS + Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_BOMBERS -1});
        // this.totalFighters = Constants.MAX_INITIAL_FIGHTERS + Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_FIGHTERS -1});
        
    }


    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(b => b.myTarget === null);
    }
 


}