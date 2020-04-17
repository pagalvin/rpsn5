import { GameLogic } from "../../Game/GameLogic";

export abstract class AbstractBaseNameFactory {

    overflowBaseNameCounter: number = 0; // Used if the user picked all the base names available from the list.
    computerBaseCounter: number = 0; // base names per guy

    abstract availableBaseNames: string[];
    abstract computerPrefix: string;

    protected static instance: AbstractBaseNameFactory;

    public generateBaseName(args: {isHumanOwner: boolean }): string {

        if (args.isHumanOwner) {
            if (this.availableBaseNames.length > 0) {
                const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: this.availableBaseNames });
                this.availableBaseNames = getNameResult.allOtherNames;
                return getNameResult.baseName;
            }
            else {
                return `Genearl Base ${++this.overflowBaseNameCounter}`;
            }
        }
        else {
            return `${this.computerPrefix}${++this.computerBaseCounter}`;
        }
    }
    
}
