import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { GameLogic } from "../../../Game/GameLogic";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { Rng } from "../../../Utils/Rng";
import { NavyBaseNamesFactory } from "../../../Factories/BaseNameFactories/NavyBaseNamesFactory";

export class NavyBase extends AbstractMilitaryBase implements OrdnanceCarryingBase {

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Navy";

    public ordnance: Ordnance[];

    baseNameFactory: NavyBaseNamesFactory = NavyBaseNamesFactory.getInstance();

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);
        this.isReceivingOrders = false;
        this.Name = this.baseNameFactory.generateBaseName({isHumanOwner: args.atLocation.myMap.owner === "Human"});
        this.ordnance = [];

    }

    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(m => m.myTarget === null);
    }
 
    public activate() {
        GameLogic.activateNavyBase({forBase: this});
    }
    

}