import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";
import { OrdnanceCarryingBase } from "../Entities/WorldObjects/Bases/AbstractMilitaryBase";
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
}

export class MapUtil {

    private static readonly initialSummary: countrySummary = {
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
        totalFightersOnPatrol: 0
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
    public static GetMapLocationSingleCharacterCode(args: { forMapLocation: MapLocation }) {

        if (args.forMapLocation.Contents === null) {
            return "Empty";
        }

        switch (args.forMapLocation.Contents.WorldObjectLabel) {
            case "ABM": return "A";
            case "Air": return "B";
            case "Army": return "I";
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

    public static getMapSummary(args: { forMap: CountryMap }) {

        const isPassiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperation === "Passive";
        const isActiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperation === "Active";

        // function to,  = "allTO" = "all tageted ordnance"
        const allTO = (base: OrdnanceCarryingBase) => base.ordnance.filter(o => o.myTarget);
        const ttlTtO = (base: OrdnanceCarryingBase) => allTO(base).length;

        const addLocationToSummary = (l: MapLocation, s: countrySummary) =>
            l.Contents
                ? (
                    {
                        allAbmBases: MapUtil.isAbmBase(l) ? s.allAbmBases.concat(l.Contents as AbmBase) : s.allAbmBases,
                        totalAbmMissilesOnLine: MapUtil.isAbmBase(l) ? s.totalAbmMissilesOnLine += (l.Contents as AbmBase).totalMissiles : s.totalAbmMissilesOnLine,
                        allRadarBases: MapUtil.isRadarBase(l) ? s.allRadarBases.concat(l.Contents as RadarBase) : s.allRadarBases,
                        totalPassiveRadarStationsOnLine: isPassiveRader(l) ? s.totalPassiveRadarStationsOnLine += 1 : s.totalPassiveRadarStationsOnLine,
                        totalActiveRadarStationsOnLine: isActiveRader(l) ? s.totalActiveRadarStationsOnLine += 1 : s.totalActiveRadarStationsOnLine,
                        allArmyBases: MapUtil.isArmyBase(l) ? s.allArmyBases.concat(l.Contents as ArmyBase) : s.allArmyBases,
                        allAirBases: MapUtil.isAirBase(l) ? s.allAirBases.concat(l.Contents as AirBase) : s.allAirBases,
                        totalBombersInFlight: MapUtil.isAirBase(l) ? s.totalBombersInFlight += ttlTtO(l.Contents as AirBase) : s.totalBombersInFlight,
                        totalFightersOnPatrol: MapUtil.isAirBase(l) ? s.totalFightersOnPatrol += (l.Contents as AirBase).totalFighters : s.totalFightersOnPatrol,
                        allMissileBases: MapUtil.isMissileBase(l) ? s.allMissileBases.concat(l.Contents as MissileBase) : s.allMissileBases,
                        totalICBMsOnLine: MapUtil.isMissileBase(l) ? s.totalICBMsOnLine += ttlTtO(l.Contents as MissileBase) : s.totalICBMsOnLine,
                        allNavyBases: MapUtil.isNavyBase(l) ? s.allNavyBases.concat(l.Contents as NavyBase) : s.allNavyBases,
                        totalSubMissilesOnLine: MapUtil.isNavyBase(l) ? s.totalSubMissilesOnLine += ttlTtO(l.Contents as NavyBase) : s.totalSubMissilesOnLine,
                        targetedMapLocations: l.isTargeted ? s.targetedMapLocations.concat(l) : s.targetedMapLocations
                    } as countrySummary
                )
                : s
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
                totalFightersOnPatrol: s1.totalFightersOnPatrol + s2.totalFightersOnPatrol
            } as countrySummary
        );

        const allIn = args.forMap.map.reduce(
            (prev, curr) => addTwoSummaries(prev, mapRowSummary(curr)), this.initialSummary
        );

        // console.log(`MapUtils: getMapSummary: allIn:`, { allIn2: allIn });

        return allIn;
    }

    public static getMapLocationHtmlID(forMapLocation: MapLocation) {
        return `MapLocation_${forMapLocation.uniqueID}`;
    }
    
}