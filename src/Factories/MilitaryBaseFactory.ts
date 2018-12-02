import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { AbstractMilitaryBase } from "../Entities/WorldObjects/Bases/AbstractMilitaryBase";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { Game } from "../Entities/gameEntity";

export interface MilitaryBaseProperties {

}
export class MilitaryBaseFactory {

    private static instance: MilitaryBaseFactory;

    private readonly msh = "MilitaryBaseFactory: ";

    private nextBaseID: number = 0;

    constructor() {
        
    }

    public static getInstance() : MilitaryBaseFactory {

        if (!this.instance) {
            this.instance = new MilitaryBaseFactory();
        }

        return this.instance;
    }

    private newName(args: {forBase: AbstractMilitaryBase}) {
        // console.log(`${this.msh}: newName: typeof base:`, args.forBase.WorldObjectLabel);
        return 'xyzzy';
    }

    public createNewBase(args: {baseType: MilitaryBaseTypeLabels, atLocation: MapLocation}) {

        console.log(`MilitaryBaseFactory: createNewBase: entering with args:`, {args: args});
        
        const game = Game.getInstance();

        const newBaseProperties = {atLocation: args.atLocation, yearBuilt: game.gameYear};

        switch(args.baseType) {

            case "ABM": {
                const newBase = new AbmBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
            case "Radar": {
                const newBase = new RadarBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
            case "Navy": {
                const newBase = new NavyBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
            case "Missile": {
                const newBase = new MissileBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
            case "Air": {
                const newBase = new AirBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
            case "Army": {
                const newBase = new ArmyBase(newBaseProperties);
                newBase.Name = this.newName({forBase: newBase});
                return newBase;
            }
        }

    }

}