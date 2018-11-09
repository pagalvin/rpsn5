import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissleBase";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { AbstractMilitaryBase } from "../Entities/WorldObjects/Bases/AbstractMilitaryBase";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";

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
        console.log(`${this.msh}: newName: typeof base:`, args.forBase.BaseType);
        return 'xyzzy';
    }

    public createNewBase(args: {baseType: MilitaryBaseTypeLabels}) {

        switch(args.baseType) {

            case "ABM": {
                const newBase = new AbmBase();
                newBase.Name = this.newName({forBase: newBase});
            }
            case "Radar": {
                const newBase = new RadarBase();
                newBase.Name = this.newName({forBase: newBase});
            }
            case "Navy": {
                const newBase = new NavyBase();
                newBase.Name = this.newName({forBase: newBase});
            }
            case "Missile": {
                const newBase = new MissileBase();
                newBase.Name = this.newName({forBase: newBase});
            }
            case "Air": {
                const newBase = new AirBase();
                newBase.Name = this.newName({forBase: newBase});
            }
            case "Army": {
                const newBase = new ArmyBase();
                newBase.Name = this.newName({forBase: newBase});
            }
        }

    }

}