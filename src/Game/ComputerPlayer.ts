import { AbstractPlayer } from "./AbstractPlayer";
import { GameRules, strategicMoveOptions, tacticalMoveOptions } from "./GameRules";
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from "./GameLogic";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { Rng } from "../Utils/Rng";
import { MilitaryBaseFactory } from "../Factories/MilitaryBaseFactory";
import { MilitaryBaseTypes } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";

export class ComputerPlayer extends AbstractPlayer implements GamestateWatcher {

    public totalFunctionalPassiveRadarStations: number;
    public totalFunctionalActiveRadarStations: number;
    
    public declaredWar: boolean;
    public Name: string;
    public map: CountryMap;

    constructor() {
        super({isHuman: false});

        GameLogic.registerGamestateWatcher({watcher: this});

        this.map = new CountryMap({sizeX: 10, sizeY: 10, owner: "Computer"});
        this.Name = "Computer";
        this.declaredWar = false;
        this.totalFunctionalActiveRadarStations = 0;
        this.totalFunctionalPassiveRadarStations = 0;        
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        // console.log(`ComputerPlayer.ts: handleGamestateChange: Got a game state change:`, {details: args.details});

    }

    public playTurn() {

        const availableStrategicChoices = GameRules.getAllowedMoves().strategicOptions;

        console.log(`ComputerPlayer: playTurn: my available moves:`, availableStrategicChoices);

        // Need to pick a strategic choice
        const choice = <strategicMoveOptions>Rng.pickRandomFromArray({sourceArray: availableStrategicChoices});

        console.log(`ComputerPlayer: playTurn: my strategic choice is:`, choice);

        if (choice === "Build") {
            this.buildBases({numberToBuild: 2, allowedBases: GameRules.getAllowedMoves().tacticalOptions});
        }

        else if (choice === "Spy") {
            this.buildBases({numberToBuild: 1, allowedBases: GameRules.getAllowedMoves().tacticalOptions});
        }

        else if (choice === "Declare War") {
            console.log(`ComputerPlayer.ts: playTurn: Declaring war!`);
        }
        else {
            console.log(`ComputerPlayer.ts: playTurn: skipping my turn.`);
        }

        setTimeout(() => {
            GameLogic.advanceTurn();
        }, 500);

    }

    private buildBases(args: {numberToBuild: number, allowedBases: tacticalMoveOptions[]}) {

        console.log(`ComputerPlayer.ts: buildBases: Entering, will build ${args.numberToBuild} bases.`);

        for (let i = 0; i < args.numberToBuild; i++) {

            const toBuild = Rng.pickRandomFromArray({sourceArray: args.allowedBases});
            console.log(`ComputerPlayer.ts: buildBases: Entering, will build base:`, toBuild);

            const randX = Rng.throwDice({hiNumberMinus1: 9});
            const randY = Rng.throwDice({hiNumberMinus1: 9});

            const mapLoc = this.map.map[randX][randY];

            const base = MilitaryBaseFactory.getInstance().createNewBase({baseType: toBuild, atLocation: mapLoc});
            
            if (base) { mapLoc.placeItem({itemToPlace: base}); }
        }
        
        this.map.logDetailedMapToConsole();

    }
}