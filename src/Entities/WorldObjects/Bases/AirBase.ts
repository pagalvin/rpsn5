import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Constants } from "../../../Game/constants";
import { Rng } from "../../../Utils/Rng";
import { Ordnance } from "../../Ordnance";
import { GameLogic } from "../../../Game/GameLogic";
import { MapLocation } from "../../MapObjects/MapLocation";

export class AirBase extends AbstractMilitaryBase implements OrdnanceCarryingBase{

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Air";

    public ordnance: Ordnance[];
    public totalFighters: number;

    public isFlying: boolean;

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

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