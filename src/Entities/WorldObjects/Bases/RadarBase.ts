import { AbstractMilitaryBase } from "./AbstractMilitaryBase";
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { MapLocation } from "../../MapObjects/MapLocation";
import { nameableGAmeObject } from "../../nameableGameObject";
import { GameLogComponent } from "../../../Components/GameLogComponent";
import { GameLogic } from "../../../Game/GameLogic";
import { RadarBaseNamesFactory } from "../../../Factories/BaseNameFactories/RadarBaseNamesFactory";

export class RadarBase extends AbstractMilitaryBase implements nameableGAmeObject {
 
    public readonly WorldObjectLabel: MilitaryBaseTypeLabels = "Radar";

    public modeOfOperation: "Inactive" | "Active" | "Passive";

    baseNameFactory = RadarBaseNamesFactory.getInstance();

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        super(args);

        this.modeOfOperation = "Inactive";

        this.Name = this.baseNameFactory.generateBaseName({isHumanOwner: args.atLocation.myMap.owningPlayer.isHuman});
        console.log("RadarBase.ts: ctor: got a radar base name:", this.Name)
    }

    public setModeOfOperation(args: {mode: "Active" | "Passive"}) {
        this.modeOfOperation = args.mode;
    }
}