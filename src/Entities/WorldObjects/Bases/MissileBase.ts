import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Missile } from "../../Missile";

export class MissileBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Missile";
    public gameYear: number = 1;

    public missiles: Missile[];
    
    constructor() {
        super();

        this.missiles = [];

        this.isReceivingOrders = false;
    }

    public areAllMissilesTargeted(): boolean {
        return ! this.missiles.some(m => m.myTarget === null);
    }

    public activate() {
        GameLogic.activateMissileBase({forBase: this});
    }
    
}