import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class AbmBaseNameFactory extends AbstractBaseNameFactory  {

    computerPrefix = "A";
    
    availableBaseNames: string[] = [
        "Sicilian",
        "King's Pawn",
        "Alekhine",
        "Ruy Lopez",
        "Indian Game",
        "Hungarian Opening",
        "King's Indian",
        "French",
        "Chigorin",
        "Petroff",
        "Queen's Gambit Declined",
        "Philidor",
        "Pirc",
        "Modern",
        "Queen's Gambit Accepted",
        "Slav",
        "Stonewall",
        "Benoni",
        "Tarrasch",
        "Dutch",
        "Englund",
        "Grünfeld"
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new AbmBaseNameFactory();
        }
        return this.instance;
    }

}
