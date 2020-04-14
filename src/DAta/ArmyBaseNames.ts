import { GameLogic } from "../Game/GameLogic";

export class ArmyBaseNames {

    static genericBaseCounter: number = 0;

    static availableArmyBaseNames: string[] = [
    ];

    public static getArmyBaseName(): string {
        
        if (ArmyBaseNames.availableArmyBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: ArmyBaseNames.availableArmyBaseNames });
            ArmyBaseNames.availableArmyBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Army Base ${++ArmyBaseNames.genericBaseCounter}`;
        }
    }

}
