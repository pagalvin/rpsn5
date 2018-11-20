import { AbstractPlayer } from "./AbstractPlayer";
import { GameRules, strategicMoveOptions, tacticalMoveOptions } from "./GameRules";
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from "./GameLogic";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { Rng } from "../Utils/Rng";
import { MilitaryBaseFactory } from "../Factories/MilitaryBaseFactory";
import { MilitaryBaseTypes } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { Game } from "../Entities/gameEntity";
import { MapUtil } from "../Utils/MapUtils";

export class ComputerPlayer extends AbstractPlayer implements GamestateWatcher {

    public totalFunctionalPassiveRadarStations: number;
    public totalFunctionalActiveRadarStations: number;

    public declaredWar: boolean;
    public Name: string;
    public map: CountryMap;

    constructor() {
        super({ isHuman: false });

        GameLogic.registerGamestateWatcher({ watcher: this });

        this.map = new CountryMap({ sizeX: 10, sizeY: 10, owner: "Computer" });
        this.Name = "Computer";
        this.declaredWar = false;
        this.totalFunctionalActiveRadarStations = 0;
        this.totalFunctionalPassiveRadarStations = 0;

        MapUtil.createTestBases({ onMap: this.map });

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        // console.log(`ComputerPlayer.ts: handleGamestateChange: Got a game state change:`, {details: args.details});

    }

    public playTurn() {

        const game = Game.getInstance();

        if (game.isPeacetime) {
            this.playPeacefulTurn();
            setTimeout(() => {
                GameLogic.advanceTurn();
            }, 500);
        }

        if (game.isWartime) {
            this.playWarTurn();
        }

    }

    private static testGuard: boolean = false;

    private playWarTurn() {

        if (ComputerPlayer.testGuard) { return; }

        console.log(`ComputerPlayer: playWarTurn: Entering.`);

        ComputerPlayer.testGuard = true;

        // tests
        this.radarTest();

       this.missileTest();
       
       this.airBaseTest();

    }

    private missileTest() {
        const myMapSummary = MapUtil.getMapSummary({ forMap: this.map });

        if (myMapSummary.allMissileBases.length < 1) { return; }

        const missile1 = myMapSummary.allMissileBases[0];

        GameLogic.activateMissileBase({ forBase: missile1 });

        console.log(`ComputerPlayer.ts: missileTest: Activated a missile:`, { missile: missile1 });

        missile1.ordnance.forEach((o) => {
            GameLogic.handleMissileTargeted(
                {
                    atMapLocation: this.getRandomLocation({ fromMap: Game.getInstance().humanPlayer.map }),
                    targetingMissile: o
                });
        })
    }

    private airBaseTest() {
        const myMapSummary = MapUtil.getMapSummary({ forMap: this.map });

        if (myMapSummary.allAirBases.length < 1) { return; }

        const airBase = myMapSummary.allAirBases[0];

        GameLogic.activateAirBase({ forBase: airBase });

        console.log(`ComputerPlayer.ts: airBaseTest: Activated an air base:`, { base: airBase });

        airBase.ordnance.forEach((o) => {
            GameLogic.handleMissileTargeted(
                {
                    atMapLocation: this.getRandomLocation({ fromMap: Game.getInstance().humanPlayer.map }),
                    targetingMissile: o
                });
        })
    }

    private radarTest() {

        console.log(`ComputerPlayer.ts: radarTest: entering.`);

        const myMapSummary = MapUtil.getMapSummary({ forMap: this.map });

        if (myMapSummary.allRadarBases.length < 1) { return; }

        console.log(`ComputerPlayer.ts: radarTest: testing radar1.`);

        const radar1 = myMapSummary.allRadarBases[0];
        radar1.setModeOfOperation({ mode: "Active" });
        GameLogic.activateRadarBase({ forBase: radar1 });

        if (myMapSummary.allRadarBases.length < 2) { return; }

        console.log(`ComputerPlayer.ts: radarTest: testing radar2.`);

        const radar2 = myMapSummary.allRadarBases[1];
        radar2.setModeOfOperation({ mode: "Passive" });
        GameLogic.activateRadarBase({ forBase: radar2 });

    }

    private playPeacefulTurn() {

        const availableStrategicChoices = GameRules.getAllowedMoves().strategicOptions;

        // Need to pick a strategic choice
        const choice = <strategicMoveOptions>Rng.pickRandomFromArray({ sourceArray: availableStrategicChoices });

        console.log(`ComputerPlayer: playTurn: my strategic choice is:`, choice);

        if (choice === "Build") {
            this.buildBases({ numberToBuild: 2, allowedBases: GameRules.getAllowedMoves().tacticalOptions });
        }

        else if (choice === "Spy") {
            this.buildBases({ numberToBuild: 1, allowedBases: GameRules.getAllowedMoves().tacticalOptions });
        }

        else if (choice === "Declare War") {
            console.log(`ComputerPlayer.ts: playTurn: Declaring war!`);
        }
        else {
            console.log(`ComputerPlayer.ts: playTurn: skipping my turn.`);
        }

    }

    private buildBases(args: { numberToBuild: number, allowedBases: tacticalMoveOptions[] }) {

        console.log(`ComputerPlayer.ts: buildBases: Entering, will build ${args.numberToBuild} bases.`);

        for (let i = 0; i < args.numberToBuild; i++) {

            const toBuild = Rng.pickRandomFromArray({ sourceArray: args.allowedBases });
            console.log(`ComputerPlayer.ts: buildBases: Entering, will build base:`, toBuild);

            const mapLoc = this.getRandomLocation({ fromMap: this.map });

            // const randX = Rng.throwDice({ hiNumberMinus1: 9 });
            // const randY = Rng.throwDice({ hiNumberMinus1: 9 });

            // const mapLoc = this.map.map[randX][randY];

            const base = MilitaryBaseFactory.getInstance().createNewBase({ baseType: toBuild, atLocation: mapLoc });

            if (base) { mapLoc.placeItem({ itemToPlace: base }); }
        }

        this.map.logDetailedMapToConsole();

    }

    private getRandomLocation(args: { fromMap: CountryMap }) {
        const randX = Rng.throwDice({ hiNumberMinus1: 9 });
        const randY = Rng.throwDice({ hiNumberMinus1: 9 });

        return args.fromMap.map[randX][randY];
    }
}