import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";

export class NavyBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";
    public gameYear: number = 1;

    public ordnance: Ordnance[];

    constructor() {
        super();
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