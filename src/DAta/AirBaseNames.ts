import { GameLogic } from "../Game/GameLogic";

export class AirBaseNames {

    static genericBaseCounter: number = 0;

    static availableAirBaseNames: string[] = [
    ];

    public static getAirBaseName(): string {
        
        if (AirBaseNames.availableAirBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: AirBaseNames.availableAirBaseNames });
            AirBaseNames.availableAirBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Air Base ${++AirBaseNames.genericBaseCounter}`;
        }
    }

}
