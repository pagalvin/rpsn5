import { GameLogic } from "../Game/GameLogic";

export class RadarBaseNames {

    private static availableRadarBaseNames: string[] = [
        "Hertz",
        "Maxwell",
        "Hülsmeyer",
        "Marconi",
        "Franklin",
        "Watt",
        "Tizard",
        "Wimperis",
        "Wilkins",
        "Bowan",
        "Rowe",
        "Lindemann",
        "Dowding",
        "Randall",
        "Boot",
        "Lewis",
        "Butement",
        "Pollard",
        "Worlledge",
        "Paris",
        "Erbslöh",
        "Willisen",
        "Hollmann",
        "Schultes",
        "Taylor",
        "Young",
        "Hyland",
        "Breit",
        "Tuve",
        "Page",
        "Popov",
        "Oshchepkov",
        "Lobanov"
    ];

    public static getRadarBaseName(): string {

        const getNameReslt = GameLogic.getNameForNameableItem({fromNamesArr: this.availableRadarBaseNames});
        this.availableRadarBaseNames = getNameReslt.allOtherNames;
        return getNameReslt.baseName;
    }

}
 