import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MilitaryBaseTypeLabels, MilitaryBaseTypes, NonNullMilitaryBaseTypes } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { OrdnanceCarryingBase, AbstractMilitaryBase } from "../Entities/WorldObjects/Bases/AbstractMilitaryBase";
import { ArmyBase } from "../Entities/WorldObjects/Bases/ArmyBase";
import { MilitaryBaseFactory } from "../Factories/MilitaryBaseFactory";

export interface countrySummary {
    allAbmBases: AbmBase[];
    allRadarBases: RadarBase[];
    allArmyBases: ArmyBase[];
    allNavyBases: NavyBase[];
    allAirBases: AirBase[];
    allMissileBases: MissileBase[];
    targetedMapLocations: MapLocation[];
    totalAbmMissilesOnLine: number;
    totalICBMsOnLine: number;
    totalSubMissilesOnLine: number;
    totalPassiveRadarStationsOnLine: number;
    totalActiveRadarStationsOnLine: number;
    totalBombersInFlight: number;
    totalFightersOnPatrol: number;
    totalPopulation: number;
}

export class MapUtil {

    public static readonly initialSummary: countrySummary = {
        allAbmBases: [],
        allRadarBases: [],
        allAirBases: [],
        allArmyBases: [],
        allNavyBases: [],
        allMissileBases: [],
        targetedMapLocations: [],
        totalAbmMissilesOnLine: 0,
        totalICBMsOnLine: 0,
        totalSubMissilesOnLine: 0,
        totalPassiveRadarStationsOnLine: 0,
        totalActiveRadarStationsOnLine: 0,
        totalBombersInFlight: 0,
        totalFightersOnPatrol: 0,
        totalPopulation: 0
        }


    public static GetMapLocationSingleCharacterCode(args: { forMapLocation: MapLocation }) {

        if (args.forMapLocation.Contents === null) {
            return "Empty";
        }

        switch (args.forMapLocation.Contents.WorldObjectLabel) {
            case "ABM": return "A";
            case "Air": return "B";
            case "Army": return "T";
            case "City": return "City";
            case "Missile": return "M";
            case "Navy": return "S";
            case "Radar": return "R";
            case "Rural": return "•";
            case "Town": return "T";
       }

        return "empty";
    }

    public static isWO = (l: MapLocation, which: MilitaryBaseTypeLabels) => l.Contents && l.Contents.WorldObjectLabel === which;
    public static isAirBase = (l: MapLocation) => MapUtil.isWO(l, "Air");
    public static isArmyBase = (l: MapLocation) => MapUtil.isWO(l, "Army");
    public static isMissileBase = (l: MapLocation) => MapUtil.isWO(l, "Missile");
    public static isNavyBase = (l: MapLocation) => MapUtil.isWO(l, "Navy");
    public static isRadarBase = (l: MapLocation) => MapUtil.isWO(l, "Radar");
    public static isAbmBase = (l: MapLocation) => MapUtil.isWO(l, "ABM");

    public static applyFunctionToCountryMap<T>(args: {map: CountryMap, xformFunc: (ml : MapLocation) => void}) {

        for (let i = 0; i < args.map.map.length; i++) {
            for (let j = 0; j < args.map.map[i].length;j++) {
                args.xformFunc(args.map.map[i][j]);
            }
        }

    }

    public static allMilitaryBases(args: {forMap: CountryMap}): NonNullMilitaryBaseTypes[] {

        const summary = this.getMapSummary({forMap: args.forMap});

        const onlyMilitaryBases = ([] as NonNullMilitaryBaseTypes[]).concat(
            summary.allAbmBases,
            summary.allAirBases,
            summary.allArmyBases,
            summary.allMissileBases,
            summary.allNavyBases,
            summary.allRadarBases
            );

        return onlyMilitaryBases;

    }

    public static getMapSummary(args: { forMap: CountryMap }): countrySummary {

        const isPassiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperation === "Passive";
        const isActiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperation === "Active";

        // function to,  = "allTO" = "all tageted ordnance"
        const allTO = (base: OrdnanceCarryingBase) => base.ordnance.filter(o => o.myTarget && o.wasConsumed === false);
        const ttlTtO = (base: OrdnanceCarryingBase) => allTO(base).length;

        const mu = MapUtil;

        const addLocationToSummary = (mapLoc: MapLocation, addToSummary: countrySummary) =>
            mapLoc.Contents
                ? (
                    {
                        allAbmBases: mu.isAbmBase(mapLoc) ? addToSummary.allAbmBases.concat(mapLoc.Contents as AbmBase) : addToSummary.allAbmBases,
                        totalAbmMissilesOnLine: mu.isAbmBase(mapLoc) ? addToSummary.totalAbmMissilesOnLine += (mapLoc.Contents as AbmBase).totalMissiles : addToSummary.totalAbmMissilesOnLine,
                        allRadarBases: mu.isRadarBase(mapLoc) ? addToSummary.allRadarBases.concat(mapLoc.Contents as RadarBase) : addToSummary.allRadarBases,
                        totalPassiveRadarStationsOnLine: isPassiveRader(mapLoc) ? addToSummary.totalPassiveRadarStationsOnLine += 1 : addToSummary.totalPassiveRadarStationsOnLine,
                        totalActiveRadarStationsOnLine: isActiveRader(mapLoc) ? addToSummary.totalActiveRadarStationsOnLine += 1 : addToSummary.totalActiveRadarStationsOnLine,
                        allArmyBases: mu.isArmyBase(mapLoc) ? addToSummary.allArmyBases.concat(mapLoc.Contents as ArmyBase) : addToSummary.allArmyBases,
                        allAirBases: mu.isAirBase(mapLoc) ? addToSummary.allAirBases.concat(mapLoc.Contents as AirBase) : addToSummary.allAirBases,
                        totalBombersInFlight: mu.isAirBase(mapLoc) ? addToSummary.totalBombersInFlight += ttlTtO(mapLoc.Contents as AirBase) : addToSummary.totalBombersInFlight,
                        totalFightersOnPatrol: mu.isAirBase(mapLoc) ? addToSummary.totalFightersOnPatrol += (mapLoc.Contents as AirBase).totalFighters : addToSummary.totalFightersOnPatrol,
                        allMissileBases: mu.isMissileBase(mapLoc) ? addToSummary.allMissileBases.concat(mapLoc.Contents as MissileBase) : addToSummary.allMissileBases,
                        totalICBMsOnLine: mu.isMissileBase(mapLoc) ? addToSummary.totalICBMsOnLine += ttlTtO(mapLoc.Contents as MissileBase) : addToSummary.totalICBMsOnLine,
                        allNavyBases: mu.isNavyBase(mapLoc) ? addToSummary.allNavyBases.concat(mapLoc.Contents as NavyBase) : addToSummary.allNavyBases,
                        totalSubMissilesOnLine: mu.isNavyBase(mapLoc) ? addToSummary.totalSubMissilesOnLine += ttlTtO(mapLoc.Contents as NavyBase) : addToSummary.totalSubMissilesOnLine,
                        targetedMapLocations: mapLoc.isTargeted ? addToSummary.targetedMapLocations.concat(mapLoc) : addToSummary.targetedMapLocations,
                        totalPopulation: addToSummary.totalPopulation += mapLoc.Contents.Population
                    } as countrySummary
                )
                : addToSummary
            ;

        const mapRowSummary = (row: MapLocation[]) =>
            row.reduce((prev, curr) => addLocationToSummary(curr, prev), this.initialSummary);

        const addTwoSummaries = (s1: countrySummary, s2: countrySummary) => (
            {
                allAbmBases: s1.allAbmBases.concat(s2.allAbmBases),
                totalAbmMissilesOnLine: s1.totalAbmMissilesOnLine + s2.totalAbmMissilesOnLine,
                allRadarBases: s1.allRadarBases.concat(s2.allRadarBases),
                allAirBases: s1.allAirBases.concat(s2.allAirBases),
                allArmyBases: s1.allArmyBases.concat(s2.allArmyBases),
                allMissileBases: s1.allMissileBases.concat(s2.allMissileBases),
                allNavyBases: s1.allNavyBases.concat(s2.allNavyBases),
                targetedMapLocations: s1.targetedMapLocations.concat(s2.targetedMapLocations),
                totalICBMsOnLine: s1.totalICBMsOnLine + s2.totalICBMsOnLine,
                totalSubMissilesOnLine: s1.totalSubMissilesOnLine + s2.totalSubMissilesOnLine,
                totalPassiveRadarStationsOnLine: s1.totalPassiveRadarStationsOnLine + s2.totalPassiveRadarStationsOnLine,
                totalActiveRadarStationsOnLine: s1.totalActiveRadarStationsOnLine + s2.totalActiveRadarStationsOnLine,
                totalBombersInFlight: s1.totalBombersInFlight + s2.totalBombersInFlight,
                totalFightersOnPatrol: s1.totalFightersOnPatrol + s2.totalFightersOnPatrol,
                totalPopulation: s1.totalPopulation + s2.totalPopulation
            } as countrySummary
        );

        const allIn = args.forMap.map.reduce(
            (runningSummary, currentMapRow) => addTwoSummaries(runningSummary, mapRowSummary(currentMapRow)), this.initialSummary
        );

        // somehow, the reduce stuff up above is over-calculating the population.
        let runningPop = 0;
        for (let i = 0; i < args.forMap.map.length; i++) {
            for (let j = 0; j < args.forMap.map[i].length; j++) {
                const {Contents} = args.forMap.map[i][j];
                if (Contents !== null) {
                    runningPop += (Contents.Population);
                    }
                // console.log(`[${i}] [${j}]: pop: ${runningPop}`);
            }
        }
        allIn.totalPopulation = runningPop;

        // console.log(`MapUtils: getMapSummary: allIn:`, { map: args.forMap, allIn: allIn, population: allIn.totalPopulation, name: args.forMap.owner });

        return allIn;
    }

    public static getMapLocationHtmlID(forMapLocation: MapLocation) {
        return `MapLocation_${forMapLocation.uniqueID}`;
    }
 
    public static createTestBases(args: {onMap: CountryMap}) {

        const mLoc = args.onMap.map[0][7];
        const m = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Missile", atLocation: mLoc});
        const rLoc = args.onMap.map[0][1];
        const r = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Radar", atLocation: rLoc});
        const rLoc2 = args.onMap.map[0][2];
        const r2 = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Radar", atLocation: rLoc2});
        const bLoc = args.onMap.map[0][3];
        const b = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Air", atLocation: bLoc});
        const nLoc = args.onMap.map[0][4];
        const n = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Navy", atLocation: nLoc});
        const aLoc = args.onMap.map[0][5];
        const a = MilitaryBaseFactory.getInstance().createNewBase({baseType: "Army", atLocation: aLoc});
        const abmLoc = args.onMap.map[0][6];
        const abm = MilitaryBaseFactory.getInstance().createNewBase({baseType: "ABM", atLocation: abmLoc});

        if (m) {mLoc.placeItem({itemToPlace: m});}
        if (r) {rLoc.placeItem({itemToPlace: r});}
        if (r2) {rLoc2.placeItem({itemToPlace: r2});}
        if (b) {bLoc.placeItem({itemToPlace: b});}
        if (n) {nLoc.placeItem({itemToPlace: n});}
        if (a) {aLoc.placeItem({itemToPlace: a});}
        if (abm) {abmLoc.placeItem({itemToPlace: abm});}


    }
}