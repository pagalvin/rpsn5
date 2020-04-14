import { GameLogic } from "../Game/GameLogic";

export class MissileBaseNames {

    static genericBaseCounter: number = 0;

    static availableMissileBaseNames: string[] = [
    ];

    public static getMissileBaseName(): string {
        
        if (MissileBaseNames.availableMissileBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: MissileBaseNames.availableMissileBaseNames });
            MissileBaseNames.availableMissileBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Missile Base ${++MissileBaseNames.genericBaseCounter}`;
        }
    }

}
