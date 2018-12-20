import { Rng } from "../Utils/Rng";

interface radarBaseNameProcessResult {
    baseName: string,
    allOtherBases: string[]
}



export class RadarNames {

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

        const selectedBaseIdx = Rng.throwDice({hiNumberMinus1: this.availableRadarBaseNames.length});
        
        const emptyProcessResult: radarBaseNameProcessResult = 
        {
            allOtherBases: [], 
            baseName: ""
        };
        
        const processedResult = this.availableRadarBaseNames.reduce ((prev: radarBaseNameProcessResult, curr, idx) => {
            
            if (idx === selectedBaseIdx) return {allOtherBases: prev.allOtherBases, baseName: curr} as radarBaseNameProcessResult;

            return {
                allOtherBases: prev.allOtherBases.concat(curr),
                baseName: prev.baseName
            } as radarBaseNameProcessResult;
        }, emptyProcessResult);

        this.availableRadarBaseNames = emptyProcessResult.allOtherBases;
        return processedResult.baseName;

    }
}