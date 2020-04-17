import { AbstractMilitaryBase, OrdnanceCarryingBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Constants } from "../../../Game/constants";
import { Rng } from "../../../Utils/Rng";
import { Ordnance } from "../../Ordnance";
import { GameLogic } from "../../../Game/GameLogic";
import { MapLocation } from "../../MapObjects/MapLocation";
import { AirBaseNamesFactory } from "../../../Factories/BaseNameFactories/AirBaseNamesFactory";

export class AirBase extends AbstractMilitaryBase implements OrdnanceCarryingBase{

    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Air";

    public ordnance: Ordnance[];
    public totalFighters: number;

    public isFlying: boolean;

    baseNameFactory = AirBaseNamesFactory.getInstance();

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.Name = this.baseNameFactory.generateBaseName({isHumanOwner: args.atLocation.myMap.owningPlayer.isHuman});
        this.ordnance = [];
        this.totalFighters = 0;
        this.isFlying = false;
    }

    public activate(): void {

        console.log(`AirBase.ts: activate: entering.`);
        
        GameLogic.activateAirBase({forBase: this});

    }


    public isAllOrdnanceTargeted(): boolean {
        return ! this.ordnance.some(b => b.myTarget === null);
    }
 


}