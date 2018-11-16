
import { Game } from "../Entities/gameEntity";
import { AbstractPlayer } from "./AbstractPlayer";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { GameRules } from "./GameRules";
import { Rng } from "../Utils/Rng";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { Constants } from "./constants";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { Missile } from "../Entities/Missile";
import { MapLocation } from "../Entities/MapObjects/MapLocation";

export type gameStateChangeType =
    "Advance Turn" |
    "no change" |
    "War Declared" |
    "Computer Playing Its Turn" |
    "Computer Finished Its Turn" |
    "Map Location Targeted" |
    "Tick";

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
}

export interface GamestateWatcher {
    handleGamestateChange: (args: { details: gameStateChangeDetails }) => void;
}



export class GameLogic {

    private static gameStateWatchers: GamestateWatcher[] = [];

    public static registerGamestateWatcher(args: { watcher: GamestateWatcher }) {
        this.gameStateWatchers = this.gameStateWatchers.concat(args.watcher);
    }

    private static notifyGamestateChange(args: { details: gameStateChangeDetails }) {

        // console.log(`GameLogic: notifyGamestateChange(): notifying watchers:`, { watchers: this.gameStateWatchers });

        this.gameStateWatchers.forEach(gsw => gsw.handleGamestateChange({ details: args.details }));
    }

    public static playComputerTurn(): void {

        const game = Game.getInstance();

        this.notifyGamestateChange({ details: { changeLabel: "Computer Playing Its Turn" } })

        game.computerPlayer.playTurn();

        // this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});

    }

    public static activateAbmBase(args: {forBase: AbmBase}) {

        args.forBase.totalMissiles = Rng.throwDice({hiNumberMinus1: 5}) + 1;
        args.forBase.isTracking = true;

        return;

    }

    public static handleMissileTargeted(args: {atMapLocation: MapLocation, targetingMissile: Missile}) {
        args.atMapLocation.isTargeted = true;

        this.notifyGamestateChange({details: {changeLabel: "Map Location Targeted"}})
    }

    public static activateMissileBase(args: {forBase: MissileBase}) {
        args.forBase.isReceivingOrders = true;
        const totalMissiles = Rng.throwDice({hiNumberMinus1: Constants.MAX_ICBMS -1}) + Constants.MIN_ICBMS;

        for (let i = 0; i < totalMissiles; i++) {
            args.forBase.missiles = args.forBase.missiles.concat(new Missile({parentBase: args.forBase}));
        }
    }

    public static activateNavyBase(args: {forBase: NavyBase}) {

        args.forBase.isReceivingOrders = true;
        args.forBase.didLaunchMissles = true; // temporary shim, real logic to come later
    }

    public static activateArmyBase(args: {forBase: ArmyBase}) {

        args.forBase.isDecamped = true;

        return;

    }

    public static startClock() {

        let isSleeping: boolean = false;
        const oneSecond = 1000;

        setInterval(() => {

            if (isSleeping) {
                // do nothing
            }
            else {

                const timeout = 3000; // 3 seconds

                isSleeping = true;

                setTimeout(() => {
                    // console.log(`GameLogic.ts: startClock: broadcasting a game tick.`);
                    GameLogic.pulseClock();
                    isSleeping = false;
                }, timeout);
            }

        }, oneSecond);

    }

    private static pulseClock() {
        this.notifyGamestateChange({ details: { changeLabel: "Tick" } });
    }

    public static declareWar(args: { declaringPlayer: AbstractPlayer }) {
        console.log(`GameLogic.ts: declareWar: A player declared war:`, { declaringPlayer: args.declaringPlayer });
        args.declaringPlayer.declaredWar = true; // Gives a first-strike bonus but world opinion takes a huge hit

        Game.getInstance().isPeacetime = false;
        Game.getInstance().isWartime = false;

        this.notifyGamestateChange({ details: { changeLabel: "War Declared" } });
    }


    public static finishHumanTurn(): void {
        this.playComputerTurn();
    }

    public static finishComputerTurn(): void {
        this.notifyGamestateChange({ details: { changeLabel: "Advance Turn" } });
    }

    public static advanceTurn(): void {

        const game = Game.getInstance();

        game.turn++;

        console.log(`GameLogic.ts: advanceTurn: new game turn / year:`, { turn: game.turn, year: game.gameYear });

        this.notifyGamestateChange({ details: { changeLabel: "Advance Turn" } });

        return;

    }
}