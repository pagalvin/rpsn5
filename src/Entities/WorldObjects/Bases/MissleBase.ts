import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapComponent } from "../../../Components/MapComponent";
import { GameLogic } from "../../../Game/GameLogic";

export class MissileBase extends AbstractMilitaryBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Missile";
    public gameYear: number = 1;

    public totalMissiles: number;
    public missileTargets: MapComponent[];
    
    constructor() {
        super();

        this.totalMissiles = 0;
        this.missileTargets = [];

        this.isReceivingOrders = false;
    }

    public activate() {
        GameLogic.activateMissileBase({forBase: this});
    }
    
}