
import { Game } from "../Entities/gameEntity";
import { AbstractPlayer } from "./AbstractPlayer";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { GameRules } from "./GameRules";
import { Rng } from "../Utils/Rng";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { Constants } from "./constants";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { Ordnance } from "../Entities/Ordnance";
import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { MapUtil } from "../Utils/MapUtils";

export type gameStateChangeType =
    "Advance Turn" |
    "Base Activated" |
    "Computer Finished Its Turn" |
    "Computer Playing Its Turn" |
    "Location Nuked" |
    "Map Location Targeted" |
    "no change" |
    "Tick" |
    "War Declared";

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
    relatedLocation?: MapLocation;
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

        game.currentPlayer = game.computerPlayer;

        game.computerPlayer.playTurn();

        game.currentPlayer = game.humanPlayer;

    }

    public static activateAbmBase(args: { forBase: AbmBase }) {

        args.forBase.totalMissiles = Rng.throwDice({ hiNumberMinus1: 5 }) + 1;
        args.forBase.isTracking = true;

        this.notifyGamestateChange({details: {changeLabel: "Base Activated"}});

        return;

    }

    public static handleMissileTargeted(args: { atMapLocation: MapLocation, targetingMissile: Ordnance }) {

        const game = Game.getInstance();
        args.atMapLocation.isTargeted = true;

        args.targetingMissile.myTarget = args.atMapLocation;

        game.currentPlayer.targetedOrdnanceItems = game.currentPlayer.targetedOrdnanceItems.concat(args.targetingMissile);

        this.notifyGamestateChange({ details: { changeLabel: "Map Location Targeted" } })
    }

    public static activateMissileBase(args: { forBase: MissileBase }) {
        args.forBase.isReceivingOrders = true;

        const totalBombers = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        for (let i = 0; i < totalBombers; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateAirBase(args: { forBase: AirBase }) {

        console.log(`GameLogic: activateAirBase: Entering:`, args);

        args.forBase.isReceivingOrders = true;

        const totalFighters = Constants.MAX_INITIAL_FIGHTERS + Rng.throwDice({ hiNumberMinus1: Constants.MAX_INITIAL_FIGHTERS - 1 });
        args.forBase.totalFighters = totalFighters;

        const totalBombers = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        for (let i = 0; i < totalBombers; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateNavyBase(args: { forBase: NavyBase }) {

        args.forBase.isReceivingOrders = true;

        const totalMissiles = Rng.throwDice({ hiNumberMinus1: Constants.MIN_SUB_MISSILES - 1 }) + Constants.MAX_SUB_MISSILES;

        for (let i = 0; i < totalMissiles; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateArmyBase(args: { forBase: ArmyBase }) {

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

        if (Game.getInstance().isWartime) { this.resolveWartimeAttacks(); }

    }

    private static resolveWartimeAttacks() {

        const resolveAttack = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer, locationUnderAttack: MapLocation }) => {

            console.log(`resolveWartimeAttack: resolveAttack: entering, args:`, {args: args});

            const attackingOrdnance = args.attackingPlayer.targetedOrdnanceItems.filter((ao) => {
                if (ao.myTarget === null) return false;
                if (ao.wasConsumed) return false;
                return (ao.myTarget.uniqueID === args.locationUnderAttack.uniqueID);
            })[0];

            console.log(`resolveWartimeAttack: resolveAttack: found ordnance:`, {foundAttackingOrdnance: attackingOrdnance});

            if (attackingOrdnance) {
                const nukeDamage = GameRules.getLocationDamage(
                    { 
                        attackedBy: attackingOrdnance, 
                        locationAttacked: args.locationUnderAttack 
                    });

                args.locationUnderAttack.nuclearDamage = nukeDamage;
                attackingOrdnance.wasConsumed = true;
            }
        }

        const resolveAttacksOnPlayer = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer }) => {

            const { map } = args.defendingPlayer;

            const locationsUnderAttack = MapUtil.getMapSummary({ forMap: map }).targetedMapLocations;

            for (let i = 0; i < locationsUnderAttack.length; i++) {
                resolveAttack({ attackingPlayer: args.attackingPlayer, defendingPlayer: args.defendingPlayer, locationUnderAttack: locationsUnderAttack[i] });
                this.notifyGamestateChange({ details: { changeLabel: "Location Nuked", relatedLocation: locationsUnderAttack[i] } });
            }
        };

        console.log(`GameLogic: resolveWartimeAttacks: Entering.`);

        const game = Game.getInstance();

        const attacker = game.currentPlayer;

        const defender = game.currentPlayer.isHuman ? game.computerPlayer : game.humanPlayer;

        resolveAttacksOnPlayer({ attackingPlayer: attacker, defendingPlayer: defender });

    }

    public static declareWar(args: { declaringPlayer: AbstractPlayer }) {

        console.log(`GameLogic.ts: declareWar: A player declared war:`, { declaringPlayer: args.declaringPlayer });

        args.declaringPlayer.declaredWar = true; // Gives a first-strike bonus but world opinion takes a  hit

        Game.getInstance().isPeacetime = false;
        Game.getInstance().isWartime = true;

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