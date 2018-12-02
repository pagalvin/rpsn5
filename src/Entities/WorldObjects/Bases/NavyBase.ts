import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { Rng } from "../../../Utils/Rng";

export class NavyBase extends AbstractMilitaryBase implements OrdnanceCarryingBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";

    public ordnance: Ordnance[];

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);
        this.isReceivingOrders = false;
        this.ordnance = [];
    }

    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(m => m.myTarget === null);
    }
 
    public activate() {
        GameLogic.activateNavyBase({forBase: this});
    }
    

}