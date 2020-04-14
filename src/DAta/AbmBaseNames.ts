import { GameLogic } from "../Game/GameLogic";

export class AbmBaseNames {

    static genericBaseCounter: number = 0;

    static availableAbmBaseNames: string[] = [
    ];

    public static getAbmBaseName(): string {
        
        if (AbmBaseNames.availableAbmBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: AbmBaseNames.availableAbmBaseNames });
            AbmBaseNames.availableAbmBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Abm Base ${++AbmBaseNames.genericBaseCounter}`;
        }
    }

}
