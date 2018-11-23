
import { Game } from "../Entities/gameEntity";
import { AbstractPlayer } from "./AbstractPlayer";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { GameRules, nuclearStrikeDamage } from "./GameRules";
import { Rng } from "../Utils/Rng";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { Constants } from "./constants";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { Ordnance } from "../Entities/Ordnance";
import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { MapUtil } from "../Utils/MapUtils";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MilitaryBaseTypes } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";

export type gameStateChangeType =
    "Advance Turn" |
    "Base Activated" |
    "Computer Finished Its Turn" |
    "Computer Playing Its Turn" |
    "ICBM Intercepted" |
    "Location Nuked" |
    "Map Location Targeted" |
    "no change" |
    "Tick" |
    "War Declared";

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
    relatedLocation?: MapLocation;
    relatedBase?: MilitaryBaseTypes; 
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

        const { forBase } = args;

        forBase.totalMissiles = Rng.throwDice({ hiNumberMinus1: 5 }) + 1;
        forBase.isTracking = true;
        forBase.isReceivingOrders = true;

        this.notifyGamestateChange({ details: { changeLabel: "Base Activated", relatedBase: forBase } });

        return;

    }

    public static handleMissileTargeted(args: {attackingPlayer: AbstractPlayer, atMapLocation: MapLocation, targetingOrdnance: Ordnance }) {

        args.atMapLocation.isTargeted = true;

        args.targetingOrdnance.myTarget = args.atMapLocation;

        args.attackingPlayer.targetedOrdnanceItems = args.attackingPlayer.targetedOrdnanceItems.concat(args.targetingOrdnance);

        this.notifyGamestateChange({ details: { changeLabel: "Map Location Targeted", relatedLocation: args.atMapLocation } })
    }

    public static activateMissileBase(args: { forBase: MissileBase }) {
        args.forBase.isReceivingOrders = true;

        this.notifyGamestateChange({details: {relatedBase: args.forBase, changeLabel: "Base Activated"}});

        const totalBombers = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        args.forBase.ordnance = [];

        for (let i = 0; i < totalBombers; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }


    }

    public static activateAirBase(args: { forBase: AirBase }) {

        console.log(`GameLogic: activateAirBase: Entering:`, args);

        args.forBase.isReceivingOrders = true;

        this.notifyGamestateChange({details: {relatedBase: args.forBase, changeLabel: "Base Activated"}});

        const totalFighters = Constants.MAX_INITIAL_FIGHTERS + Rng.throwDice({ hiNumberMinus1: Constants.MAX_INITIAL_FIGHTERS - 1 });
        args.forBase.totalFighters = totalFighters;

        const totalBombers = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        for (let i = 0; i < totalBombers; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateNavyBase(args: { forBase: NavyBase }) {

        args.forBase.isReceivingOrders = true;

        this.notifyGamestateChange({details: {relatedBase: args.forBase, changeLabel: "Base Activated"}});

        const totalMissiles = Rng.throwDice({ hiNumberMinus1: Constants.MIN_SUB_MISSILES - 1 }) + Constants.MAX_SUB_MISSILES;

        for (let i = 0; i < totalMissiles; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateArmyBase(args: { forBase: ArmyBase }) {

        this.notifyGamestateChange({details: {relatedBase: args.forBase, changeLabel: "Base Activated"}});

        args.forBase.isDecamped = true;

        return;

    }

    public static activateRadarBase(args: { forBase: RadarBase}) {

        this.notifyGamestateChange({details: {relatedBase: args.forBase, changeLabel: "Base Activated"}});

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

        if (Game.getInstance().isWartime) { 
            this.resolveWartimeAttacks(); 
            Game.getInstance().computerPlayer.playTurn();
        }

    }

    private static damageLocation(args: {location: MapLocation, withOrdnance: Ordnance}) {

    }

    private static resolveWartimeAttacks() {

        const tryAbmDefense = (args: { nuclearOrdnance: Ordnance, defenders: AbmBase[] }) => {

            console.log(`GameLogic.ts: tryAbmDefense: Entering.`);

            const { myWorldLabel } = args.nuclearOrdnance;

            const maxAbmTries = () => (myWorldLabel === "ICBM" || myWorldLabel === "Submarine Missile") ? 1 : 2;

            const tryIntercept = (args: { nuclearOrdnance: Ordnance, defender: AbmBase }) => {

                console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Entering.`);

                const didShootDownOrdnance1 = Rng.throwDice({ hiNumberMinus1: 100 }) < 50;

                console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: did shoot down?`, didShootDownOrdnance1);

                // consume an abm missile.
                args.defender.totalMissiles--;

                if (didShootDownOrdnance1) {

                    console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Successfully intercepted.`);

                    args.nuclearOrdnance.wasConsumed = true;
                    args.nuclearOrdnance.wasIntercepted = true;
                    return true;
                }
            }

            let abmBaseIndex = 0;

            if (tryIntercept({ nuclearOrdnance: args.nuclearOrdnance, defender: args.defenders[abmBaseIndex] })) {
                return true;
            }

            if (maxAbmTries() < 2) { return false;}

            abmBaseIndex = -1;
            if (args.defenders[0].totalMissiles > 0) { abmBaseIndex = 0 }
            if (args.defenders[0].totalMissiles < 1 && args.defenders.length > 1) { abmBaseIndex = 1 }

            if (tryIntercept({ nuclearOrdnance: args.nuclearOrdnance, defender: args.defenders[abmBaseIndex] })) {
                return true;
            }

            console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Failed to intercept.`);

            return false;

        }

        const tryAttack = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer, locationUnderAttack: MapLocation }) : nuclearStrikeDamage | "failed" => {

            console.log(`resolveWartimeAttacks: tryAttack: entering, args:`, { args: args });

            const attackingOrdnance = args.attackingPlayer.targetedOrdnanceItems.filter((ao) => {
                if (ao.myTarget === null) return false;
                if (ao.wasConsumed) return false;
                return (ao.myTarget.uniqueID === args.locationUnderAttack.uniqueID);
            })[0];

            console.log(`resolveWartimeAttacks: tryAttack: found ordnance:`, { foundAttackingOrdnance: attackingOrdnance });

            if (attackingOrdnance) {

                attackingOrdnance.wasConsumed = true;

                const defendingPlayerMapSummary = MapUtil.getMapSummary({ forMap: args.defendingPlayer.map });

                console.log(`resolveWartimeAttacks: tryAttack: player is defending attack:`, {
                    attackingOrdnance: attackingOrdnance,
                    defendingPlayerMapSummary: defendingPlayerMapSummary
                });

                if (attackingOrdnance.myWorldLabel === "ICBM") {

                    console.log(`resolveWartimeAttacks: tryAttack: player is defending attack against ICBM.`);
    
                    if (defendingPlayerMapSummary.totalAbmMissilesOnLine > 0 || true) {

                        console.log(`resolveWartimeAttacks: tryAttack: player is trying an ABM defense.`);

                        const icbmWasDestroyed = tryAbmDefense({defenders: defendingPlayerMapSummary.allAbmBases, nuclearOrdnance: attackingOrdnance})

                        if (icbmWasDestroyed) {
                            console.log(`resolveWartimeAttacks: tryAttack: resolveAttack: attacking player's ICBM was shot down by an ABM.`, 
                            {
                                attackerName: args.attackingPlayer.Name,
                                attackingPlayer: args.attackingPlayer,
                                defendingPlayer: args.defendingPlayer,
                                locationAttacked: args.locationUnderAttack
                            });

                            this.notifyGamestateChange({details: {changeLabel: "ICBM Intercepted", relatedLocation: args.locationUnderAttack}});

                            return "failed";
                    }                  

                        console.log(`resolveWartimeAttacks: tryAttack: Missile successfully hit target.`);

                    }
                }

                const nukeDamage = GameRules.getLocationDamage(
                    {
                        attackedBy: attackingOrdnance,
                        locationAttacked: args.locationUnderAttack
                    });

                // args.locationUnderAttack.nuclearStrikes = nukeDamage.strikeCount;
                // if (args.locationUnderAttack.Contents) { args.locationUnderAttack.Contents.Population -= nukeDamage.populationKilled; }

                return nukeDamage;
            }
            else {
                console.log(`resolveWartimeAttack: resolveAttack: there was no ordnance to attack with.`);
                return "failed";
            }
        }

        const resolveAttacksOnPlayer = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer }) => {

            const defendersMap = args.defendingPlayer.map;
            const locationsUnderAttack = MapUtil.getMapSummary({ forMap: defendersMap }).targetedMapLocations;

            if (args.attackingPlayer.targetedOrdnanceItems.length < 1) { return }
            
            for (let i = 0; i < locationsUnderAttack.length; i++) {

                const { Contents} = locationsUnderAttack[i];

                if (! Contents) continue;

                const result = tryAttack({ attackingPlayer: args.attackingPlayer, defendingPlayer: args.defendingPlayer, locationUnderAttack: locationsUnderAttack[i] });
                if (result === "failed")
                {
                    this.notifyGamestateChange({ details: { changeLabel: "ICBM Intercepted", relatedLocation: locationsUnderAttack[i] } });
                } 
                else {
                    locationsUnderAttack[i].nuclearStrikes = result.strikeCount;
                    Contents.Population -= result.populationKilled;
                    this.notifyGamestateChange({ details: { changeLabel: "Location Nuked", relatedLocation: locationsUnderAttack[i] } });
                }

                MapUtil.applyFunctionToCountryMap({map: defendersMap, xformFunc: (ml: MapLocation) => {ml.isTargeted = false}});
            }
        };

        console.log(`GameLogic: resolveWartimeAttacks: Entering.`);

        const game = Game.getInstance();

        const playerA = game.currentPlayer;

        const playerB = game.currentPlayer.isHuman ? game.computerPlayer : game.humanPlayer;

        if (playerA.targetedOrdnanceItems.length > 0) {
            resolveAttacksOnPlayer({ attackingPlayer: playerA, defendingPlayer: playerB });
        }

        if (playerB.targetedOrdnanceItems.length > 0) {
            resolveAttacksOnPlayer({ attackingPlayer: playerB, defendingPlayer: playerA });
        }
    }

    public static declareWar(args: { declaringPlayer: AbstractPlayer }) {

        console.log(`GameLogic.ts: declareWar: A player declared war:`, { declaringPlayer: args.declaringPlayer });

        args.declaringPlayer.declaredWar = true; // Gives a first-strike bonus but world opinion takes a  hit

        Game.getInstance().isPeacetime = false;
        Game.getInstance().isWartime = true;

        this.notifyGamestateChange({ details: { changeLabel: "War Declared" } });
    }

    public static finishHumanTurn(): void {
        Game.getInstance().currentPlayer = Game.getInstance().computerPlayer;
        this.playComputerTurn();
        Game.getInstance().currentPlayer = Game.getInstance().humanPlayer;
    }

    public static finishComputerTurn(): void {
        Game.getInstance().currentPlayer = Game.getInstance().humanPlayer;
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