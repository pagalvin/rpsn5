import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { MissileBaseNames } from "../../../Data/MissileBaseNames";

export class MissileBase extends AbstractMilitaryBase implements OrdnanceCarryingBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Missile";
    public : number = 1;

    public ordnance: Ordnance[];
    
    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.Name = MissileBaseNames.getMissileBaseName();
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