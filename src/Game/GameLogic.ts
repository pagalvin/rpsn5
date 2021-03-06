
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
import { MilitaryBaseTypes, NonNullMilitaryBaseTypes } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { getNameProcessResult } from "../Entities/nameableGameObject";
import { AbstractMilitaryBase } from "../Entities/WorldObjects/Bases/AbstractMilitaryBase";

export type gameStateChangeType =
    "Advance Turn" |
    "Base Activated" |
    "Base Consumed" |
    "Bomber was shot down by ABM" |
    "Bomber was shot down by Fighter" |
    "Computer Finished Its Turn" |
    "Computer Playing Its Turn" |
    "ICBM Intercepted" |
    "Location Nuked" |
    "Map Location Targeted" |
    "New base constructed" |
    "no change" |
    "Submarine Missile Shot Down By ABM" |
    "Tick" |
    "Initializing ..." |
    "Initialization complete, make your first move." |
    "HighlightMapLocation" |
    "DeHighlightMapLocation" |
    "War Declared";

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
    relatedLocation?: MapLocation;
    relatedBase?: Exclude<MilitaryBaseTypes,null>;
    miscDetails?: string;
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

        this.notifyGamestateChange({ details: { changeLabel: "Computer Playing Its Turn", miscDetails: game.currentPlayer.Name } })

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

    public static handleMissileTargeted(args: { attackingPlayer: AbstractPlayer, atMapLocation: MapLocation, targetingOrdnance: Ordnance }) {

        const {targetingOrdnance} = args;

        args.atMapLocation.isTargeted = true;

        targetingOrdnance.myTarget = args.atMapLocation;
        targetingOrdnance.remainingTicksBeforeStriking = GameRules.getMissileArrivalTicks();
        console.log(`GameLogic: handleMissileTargeted: A missile will land in [${targetingOrdnance.remainingTicksBeforeStriking}] ticks.`);

        args.attackingPlayer.allTargetedOrdnanceItems = args.attackingPlayer.allTargetedOrdnanceItems.concat(args.targetingOrdnance);
                
        this.notifyGamestateChange({ details: { changeLabel: "Map Location Targeted", relatedLocation: args.atMapLocation } })
    }

    public static activateMissileBase(args: { forBase: MissileBase }) {

        const {forBase} = args;

        forBase.isReceivingOrders = true;

        this.notifyGamestateChange({ details: { relatedBase: args.forBase, changeLabel: "Base Activated" } });

        const totalICBMs = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        forBase.ordnance = [];

        for (let i = 0; i < totalICBMs; i++) {
            forBase.ordnance = forBase.ordnance.concat(new Ordnance({ parentBase: forBase }));
        }

    }

    public static notifyNewBaseConstructed(args: {forBaseType: MilitaryBaseTypes}) {

        this.notifyGamestateChange({details: {changeLabel: "New base constructed", relatedBase: args.forBaseType, relatedLocation: args.forBaseType.myMapLocation}});

    }

    public static notifyBaseConsumed(args: { attackingPlayer: AbstractPlayer, base: MilitaryBaseTypes}) {

        this.notifyGamestateChange({ 
            details: { 
                changeLabel: "Base Consumed", 
                relatedLocation: args.base.myMapLocation, 
                relatedBase: args.base
            } 
        })
    }

    public static activateAirBase(args: { forBase: AirBase }) {

        console.log(`GameLogic: activateAirBase: Entering:`, args);

        args.forBase.isReceivingOrders = true;

        this.notifyGamestateChange({ details: { relatedBase: args.forBase, changeLabel: "Base Activated" } });

        const totalFighters = Constants.MAX_INITIAL_FIGHTERS + Rng.throwDice({ hiNumberMinus1: Constants.MAX_INITIAL_FIGHTERS - 1 });
        args.forBase.totalFighters = totalFighters;

        const totalBombers = Rng.throwDice({ hiNumberMinus1: Constants.MAX_ICBMS - 1 }) + Constants.MIN_ICBMS;

        for (let i = 0; i < totalBombers; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateNavyBase(args: { forBase: NavyBase }) {

        args.forBase.isReceivingOrders = true;

        this.notifyGamestateChange({ details: { relatedBase: args.forBase, changeLabel: "Base Activated" } });

        const totalMissiles = Rng.throwDice({ hiNumberMinus1: Constants.MIN_SUB_MISSILES - 1 }) + Constants.MAX_SUB_MISSILES;

        for (let i = 0; i < totalMissiles; i++) {
            args.forBase.ordnance = args.forBase.ordnance.concat(new Ordnance({ parentBase: args.forBase }));
        }
    }

    public static activateArmyBase(args: { forBase: ArmyBase }) {

        this.notifyGamestateChange({ details: { relatedBase: args.forBase, changeLabel: "Base Activated" } });

        args.forBase.isDecamped = true;

        return;

    }

    public static activateRadarBase(args: { forBase: RadarBase }) {

        this.notifyGamestateChange({ details: { relatedBase: args.forBase, changeLabel: "Base Activated" } });

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

    private static resolveWartimeAttacks() {

        const tryAbmDefense = (args: { nuclearOrdnance: Ordnance, defendingPlayer: AbstractPlayer }): "succeeded" | "failed" => {

            console.log(`GameLogic.ts: tryAbmDefense: Entering.`);

            const tryIntercept = (args: { nuclearOrdnance: Ordnance, defender: AbmBase }): "succeeded" | "failed" => {

                console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Entering, ABM Base:`, {base: args.defender});

                if (! args.defender) { return "failed" }; // there is no ABM base on line to defend this attack against.

                const didShootDownOrdnance = Rng.throwDice({ hiNumberMinus1: 100 }) < 50;

                console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: did shoot down?`, didShootDownOrdnance);

                // consume an abm missile.
                args.defender.totalMissiles--;

                // Notify map UI that this ABM base was used up.
                if (args.defender.totalMissiles < 1) { 
                    this.notifyBaseConsumed({base: args.defender, attackingPlayer: args.defender.myMapLocation.myMap.owningPlayer});
                }

                if (didShootDownOrdnance) {

                    console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Successfully intercepted.`);

                    args.nuclearOrdnance.wasConsumed = true;
                    args.nuclearOrdnance.wasIntercepted = true;
                    return "succeeded";
                }
                else {
                    return "failed";
                }
            }

            let abmBaseIndex = 0;

            const availableABMBases = args.defendingPlayer.map.getAllDefenseCapableABMBases();

            // If no ABM bases, then the user can't defend.
            if (availableABMBases.length < 1) {
                console.log(`GameLogic.ts: tryAbmDefense: player has no ABMs, no defense possible.`);
                return "failed" 
            };

            // We get one try against ICBMs and Submarine missiles. We get two tries against bombers.
            const firstTry = tryIntercept({ nuclearOrdnance: args.nuclearOrdnance, defender: availableABMBases[abmBaseIndex] });
            if (firstTry === "succeeded") { return "succeeded"};
            
            if (args.nuclearOrdnance.myWorldLabel === "ICBM" || args.nuclearOrdnance.myWorldLabel === "Submarine Missile") {
                return "failed";
            }

            // If we get here, it's a bomber. We get a second chance to shoot it down if there are any more ABMs available.
            abmBaseIndex = -1;
            if (availableABMBases[0].totalMissiles > 0) { abmBaseIndex = 0 }
            if (availableABMBases[0].totalMissiles < 1 && availableABMBases.length > 1) { abmBaseIndex = 1 }

            const secondTry = tryIntercept({ nuclearOrdnance: args.nuclearOrdnance, defender: availableABMBases[abmBaseIndex] });

            if (secondTry === "succeeded")  {
                return "succeeded";
            }

            console.log(`GameLogic.ts: tryAbmDefense: tryIntercept: Failed to intercept.`);

            return "failed";

        }

        const tryICBMAttack = (args: {attackingOrdnance: Ordnance, defendingPlayer: AbstractPlayer,locationUnderAttack: MapLocation}): "succeeded" | "failed" => {

            const abmDefenseAttempt = tryAbmDefense({defendingPlayer: args.defendingPlayer, nuclearOrdnance: args.attackingOrdnance })

            if (abmDefenseAttempt === "succeeded") {
                console.log(`resolveWartimeAttacks: tryICBMAttack: attacking player's ICBM was shot down by an ABM.`,
                    {
                        defendingPlayer: args.defendingPlayer,
                        locationAttacked: args.locationUnderAttack
                    });

                this.notifyGamestateChange({ details: { changeLabel: "ICBM Intercepted", relatedLocation: args.locationUnderAttack } });

                return "failed";
            }

            console.log(`resolveWartimeAttacks: tryAttack: Missile successfully hit target.`);
            return "succeeded";
        }

        const tryBomberAttack = (args: {attackingOrdnance: Ordnance, defendingPlayer: AbstractPlayer,locationUnderAttack: MapLocation}): "succeeded" | "failed" => {

            const abmDefenseAttempt = tryAbmDefense({defendingPlayer: args.defendingPlayer, nuclearOrdnance: args.attackingOrdnance })

            if (abmDefenseAttempt === "succeeded") {
                console.log(`resolveWartimeAttacks: tryBomberAttack: attacking player's bomber was shot down by an ABM.`,
                    {
                        defendingPlayer: args.defendingPlayer,
                        locationAttacked: args.locationUnderAttack
                    });

                this.notifyGamestateChange({ details: { changeLabel: "Bomber was shot down by ABM", relatedLocation: args.locationUnderAttack } });

                return "failed";
            }

            console.log(`resolveWartimeAttacks: tryBomberAttack: Bomber successfully hit target.`);
            return "succeeded";
        }

        const trySubmarineAttack = (args: {attackingOrdnance: Ordnance, defendingPlayer: AbstractPlayer,locationUnderAttack: MapLocation}): "succeeded" | "failed" => {

            const abmDefenseAttempt = tryAbmDefense({defendingPlayer: args.defendingPlayer, nuclearOrdnance: args.attackingOrdnance })

            if (abmDefenseAttempt === "succeeded") {
                console.log(`resolveWartimeAttacks: trySubmarineAttack: attacking player's submarine missile was shot down by an ABM.`,
                    {
                        defendingPlayer: args.defendingPlayer,
                        locationAttacked: args.locationUnderAttack
                    });

                this.notifyGamestateChange({ details: { changeLabel: "Submarine Missile Shot Down By ABM", relatedLocation: args.locationUnderAttack } });

                return "failed";
            }

            console.log(`resolveWartimeAttacks: tryBomberAttack: Bomber successfully hit target.`);
            return "succeeded";
        }

        const getNextReadyOrdnance = (args: {attackingPlayer: AbstractPlayer, locationUnderAttack: MapLocation}) => {
            const attackingOrdnance = args.attackingPlayer.ordnanceItemsArrivingThisTick.filter((ao) => {
                if (ao.myTarget === null) return false;
                if (ao.wasConsumed) return false;
                if (ao.remainingTicksBeforeStriking > 0) return false;
                return (ao.myTarget.uniqueID === args.locationUnderAttack.uniqueID);
            })[0];

            return attackingOrdnance;
        }

        const tryAttack = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer, locationUnderAttack: MapLocation }): nuclearStrikeDamage | "failed" => {

            console.log(`resolveWartimeAttacks: tryAttack: entering, args:`, { args: args });

            // return nothing if there is no ordnance ready this turn.
            const attackingOrdnance = getNextReadyOrdnance({attackingPlayer: args.attackingPlayer, locationUnderAttack: args.locationUnderAttack});

            console.log(`resolveWartimeAttacks: tryAttack: found ordnance:`, { 
                foundAttackingOrdnance: attackingOrdnance, ticks: attackingOrdnance ? attackingOrdnance.remainingTicksBeforeStriking : "na" });

            if (attackingOrdnance) {

                attackingOrdnance.wasConsumed = true;

                const defendingPlayerMapSummary = MapUtil.getMapSummary({ forMap: args.defendingPlayer.map });

                console.log(`resolveWartimeAttacks: tryAttack: player is defending attack:`, {
                    attackingOrdnance: attackingOrdnance,
                    defendingPlayerMapSummary: defendingPlayerMapSummary
                });

                if (attackingOrdnance.myWorldLabel === "ICBM") {
                    const icbmAttackResult = tryICBMAttack({attackingOrdnance: attackingOrdnance, defendingPlayer: args.defendingPlayer, locationUnderAttack: args.locationUnderAttack});
                    if (icbmAttackResult === "failed") return "failed";
                }
                else if (attackingOrdnance.myWorldLabel === "Bomber") {
                    const bomberAttackResult = tryBomberAttack({attackingOrdnance: attackingOrdnance, defendingPlayer: args.defendingPlayer, locationUnderAttack: args.locationUnderAttack});
                    if (bomberAttackResult === "failed") return "failed";
                }
                else if (attackingOrdnance.myWorldLabel === "Submarine Missile") {
                    const subMissileAttackResult = trySubmarineAttack({attackingOrdnance: attackingOrdnance, defendingPlayer: args.defendingPlayer, locationUnderAttack: args.locationUnderAttack});
                    if (subMissileAttackResult === "failed") return "failed";
                }
                else {
                    console.error(`GameLogic.ts: tryAttack: Error: tried to attack with unknown ordnance type:`, attackingOrdnance);
                    return "failed";
                }

                const nukeDamage = GameRules.getLocationDamage(
                    {
                        attackedBy: attackingOrdnance,
                        locationAttacked: args.locationUnderAttack,
                    });

                return nukeDamage;
            }
            else {
                console.error(`resolveWartimeAttack: resolveAttack: there was no ordnance to attack with.`);
                return "failed";
            }
        }

        const getUpdatedOrdnanceArrivalTicksForPlayer = (args: {p: AbstractPlayer}) => {
            return args.p.allTargetedOrdnanceItems = args.p.allTargetedOrdnanceItems
                .map (ao => ao.remainingTicksBeforeStriking < 1 ? ao : {...ao, remainingTicksBeforeStriking: ao.remainingTicksBeforeStriking -1})
        }

        const hasOrdnanceStrikingThisTick = (args: {forPlayer: AbstractPlayer}) => {
            return (
                args.forPlayer.ordnanceItemsArrivingThisTick.some(
                    o => 
                        o.remainingTicksBeforeStriking < 1 && 
                        o.wasConsumed === false && 
                        o.wasIntercepted === false
                )
            );
        }

        const resolveAttacksOnPlayer = (args: { attackingPlayer: AbstractPlayer, defendingPlayer: AbstractPlayer }) => {

            const defendersMap = args.defendingPlayer.map;

            const allTargetedLocations = MapUtil.getMapSummary({ forMap: defendersMap }).targetedMapLocations;

            const locationsUnderAttackThisTick =
                allTargetedLocations.filter(
                    aTargetedLocation => args.attackingPlayer.ordnanceItemsArrivingThisTick.filter(
                        oiatt => (
                            oiatt.wasConsumed === false &&
                            oiatt.wasIntercepted === false &&
                            oiatt.myTarget && 
                            oiatt.myTarget.uniqueID === aTargetedLocation.uniqueID)
                    ).length > 0
                )

            console.log(`GameLogic: resolveAttacksOnPlayer: player locations under attack this tick:`, {allTargetedLocations: allTargetedLocations, locationsUnderAttackThisTick});

            for (let i = 0; i < locationsUnderAttackThisTick.length; i++) {

                const { Contents } = locationsUnderAttackThisTick[i];

                const attackedLocation = locationsUnderAttackThisTick[i];

                if (!Contents) continue;

                const result = tryAttack({ attackingPlayer: args.attackingPlayer, defendingPlayer: args.defendingPlayer, locationUnderAttack: attackedLocation });

                if (result === "failed") {
                    this.notifyGamestateChange({ details: { changeLabel: "ICBM Intercepted", relatedLocation: attackedLocation } });
                }
                else {
                    damageLocation({location: locationsUnderAttackThisTick[i], damage: result});
                }

            }
        };

        const damageLocation = (args: {location: MapLocation, damage: nuclearStrikeDamage}) => {

            args.location.nuclearStrikes = args.damage.strikeCount;
            if (args.location.Contents) {args.location.Contents.Population -= args.damage.populationKilled};
            args.location.myMap.owningPlayer.totalCausualties += args.damage.populationKilled;

            if (args.location.isMilitaryBase()) {
                const militaryBase = args.location.Contents as Exclude<MilitaryBaseTypes,null>;
                militaryBase.wasDestroyed = militaryBase.wasDestroyed || Rng.throwDice({hiNumberMinus1: 100}) < 97;
                militaryBase.isReceivingOrders = militaryBase.isReceivingOrders || (militaryBase.isReceivingOrders && ! militaryBase.wasDestroyed);

                this.notifyGamestateChange({ 
                    details: { 
                        changeLabel: "Location Nuked", 
                        relatedLocation: args.location, 
                        relatedBase: militaryBase, 
                        miscDetails: `${ args.damage.populationKilled.toLocaleString()}` // citizens were killed. The ${militaryBase.WorldObjectLabel} base there (${militaryBase.Name}) ${militaryBase.wasDestroyed ? "was" : "was not"} destroyed.` 
                    } 
                });
            }
            else {
                this.notifyGamestateChange({ 
                    details: { 
                        changeLabel: "Location Nuked", 
                        relatedLocation: args.location, 
                        miscDetails: `${args.damage.populationKilled.toLocaleString()}` 
                    } 
                });
            }
        }
        
        const isLiveOrdnance = (forOrdnance: Ordnance) => ! forOrdnance.wasIntercepted && ! forOrdnance.wasConsumed;

        console.log(`GameLogic: resolveWartimeAttacks: Entering.`);

        const game = Game.getInstance();

        const playerA = game.currentPlayer;
        const playerB = game.currentPlayer.isHuman ? game.computerPlayer : game.humanPlayer;

        playerA.allTargetedOrdnanceItems = getUpdatedOrdnanceArrivalTicksForPlayer({p: playerA});
        playerB.allTargetedOrdnanceItems = getUpdatedOrdnanceArrivalTicksForPlayer({p: playerB});
        playerA.ordnanceItemsArrivingThisTick = playerA.allTargetedOrdnanceItems.filter(ato => isLiveOrdnance(ato) && ato.remainingTicksBeforeStriking < 1);
        playerB.ordnanceItemsArrivingThisTick = playerB.allTargetedOrdnanceItems.filter(ato => isLiveOrdnance(ato) && ato.remainingTicksBeforeStriking < 1);

        if (hasOrdnanceStrikingThisTick({forPlayer: playerA})) {
            console.log(`GameLogic: resolveWartimeAttacks Player A (${playerA.Name}) has ordnance ready this tick:`, playerA.ordnanceItemsArrivingThisTick);
            resolveAttacksOnPlayer({ attackingPlayer: playerA, defendingPlayer: playerB });
        }
        else {
            console.log(`GameLogic: resolveWartimeAttacks Player A (${playerA.Name}) does not have ordnance ready this tick.`);
        }

        if (hasOrdnanceStrikingThisTick({forPlayer: playerB})) {
            console.log(`GameLogic: resolveWartimeAttacks Player B (${playerB.Name}) has ordnance ready this tick:`, playerB.ordnanceItemsArrivingThisTick);
            resolveAttacksOnPlayer({ attackingPlayer: playerB, defendingPlayer: playerA });
        }
        else {
            console.log(`GameLogic: resolveWartimeAttacks Player B (${playerB.Name}) does not have ordnance ready this tick.`);
        }


        // debugger;
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

        this.increasePopulation();

        this.notifyGamestateChange({ details: { changeLabel: "Advance Turn" } });

        return;

    }

    static increasePopulation() {

        const computerPlayerMap = Game.getInstance().computerPlayer.map;
        const humanPlayerMap = Game.getInstance().humanPlayer.map;

        computerPlayerMap.increasePopulation();
        humanPlayerMap.increasePopulation();

    }

    public static spyOnPlayer(args: {targetPlayer: AbstractPlayer, spyLevel: 1 | 2}) {

        console.log(`Gamelogic: spyOnPlayer: entering, target:`, args.targetPlayer);

        /*
            Principles:
            - Tech (concealment and discovery) improves all the time
            - Older bases are less easy to conceal
            - Newer bases are easier to conceal
            - When spying in 1990, it's easier to find opponent's bases then it is in 1945
            - Towns and cities are never hidden

            On any given turn, you can discover up to two bases depending on spy level.
        */

        const allMilitaryBases = MapUtil.allMilitaryBases({forMap: args.targetPlayer.map});

        const game = Game.getInstance();

        for (let i = 0; i < allMilitaryBases.length; i++) {
            
            const base = allMilitaryBases[i];

            console.log(`GameLogic: spyOnPlayer: spying on a base:`, {base: base});

            // New bases are harder to find.
            const baseConcealmentFactor = base.yearBuilt - GameRules.GameStartYear; // gives a value like: 1950 - 1945 = 5
            
            // If this turn is a spying turn, you get a bonus..
            const baseSpyFactor = args.spyLevel === 1 ? 1.1 : 1.25; 

            // As time goes on, you get better at spying at baseline.
            const spyTechnologyFactor = (game.gameYear - GameRules.GameStartYear) * baseSpyFactor; // ex: (1950 - 1945) * 1.1 = 5.5
            
            const spyAmount = spyTechnologyFactor - baseConcealmentFactor; // 5.5 - 5 = 0.5

            allMilitaryBases[i].myMapLocation.enemyVisibility += Math.ceil(spyAmount);

        }

        const tryFindBase = (forBase: NonNullMilitaryBaseTypes) => {
            const didFind = Rng.throwDice({hiNumberMinus1: 100}) < forBase.myMapLocation.enemyVisibility;
            if (didFind) { forBase.myMapLocation.enemyVisibility =100 }
        }

        tryFindBase(Rng.pickRandomFromArray({sourceArray: allMilitaryBases}));

        if (args.spyLevel > 1) {
            tryFindBase(Rng.pickRandomFromArray({sourceArray: allMilitaryBases}));
        }
        
    }

    public static getNameForNameableItem(args: {fromNamesArr: string[]}): getNameProcessResult {

        const selectedNameIdx = Rng.throwDice({hiNumberMinus1: args.fromNamesArr.length});
        
        const emptyProcessResult: getNameProcessResult = 
        {
            allOtherNames: [], 
            baseName: ""
        };
        
        const processedResult = args.fromNamesArr.reduce ((prev: getNameProcessResult, curr, idx) => {
            
            if (idx === selectedNameIdx) return {allOtherNames: prev.allOtherNames, baseName: curr} as getNameProcessResult;

            return {
                allOtherNames: prev.allOtherNames.concat(curr),
                baseName: prev.baseName
            } as getNameProcessResult;
        }, emptyProcessResult);

        return processedResult;
    }

    public static notifyGameReady() {
        this.notifyGamestateChange({details: {changeLabel: "Initialization complete, make your first move."}});
    }

    public static notifyHighlightMapLocation(args: {mapLocation: MapLocation}) {
        this.notifyGamestateChange({details: {changeLabel: "HighlightMapLocation", relatedLocation: args.mapLocation}});
    }

    public static notifyDeHighlightMapLocation(args: {mapLocation: MapLocation}) {
        this.notifyGamestateChange({details: {changeLabel: "DeHighlightMapLocation", relatedLocation: args.mapLocation}});
    }

    
}