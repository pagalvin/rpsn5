import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";

export class MissileBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Missile";
    public gameYear: number = 1;

    public ordnance: Ordnance[];
    
    constructor() {
        super();

        this.ordnance = [];

        this.isReceivingOrders = false;
    }

    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(m => m.myTarget === null);
    }
 
    public activate() {
        GameLogic.activateMissileBase({forBase: this});
    }
    
}