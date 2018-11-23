import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { Rng } from "../../../Utils/Rng";

export class NavyBase extends AbstractMilitaryBase implements OrdnanceCarryingBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";
    public gameYear: number = 1;

    public ordnance: Ordnance[];

    public population: number;

    constructor(args: {atLocation: MapLocation}) {
        super(args);
        this.isReceivingOrders = false;
        this.ordnance = [];
        this.population = Rng.throwDice({hiNumberMinus1: 10000}) + 10000;
    }

    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(m => m.myTarget === null);
    }
 
    public activate() {
        GameLogic.activateNavyBase({forBase: this});
    }
    

}