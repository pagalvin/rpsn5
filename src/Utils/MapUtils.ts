import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { AbmBase } from "../Entities/WorldObjects/Bases/AbmBase";
import { MissileBase } from "../Entities/WorldObjects/Bases/MissileBase";
import { NavyBase } from "../Entities/WorldObjects/Bases/NavyBase";
import { RadarBase } from "../Entities/WorldObjects/Bases/RadarBase";
import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { AirBase } from "../Entities/WorldObjects/Bases/AirBase";

export interface countrySummary {
    totalAbmBases: number;
    totalRadarBases: number;
    totalArmyBases: number;
    totalNavyBases: number;
    totalAirBases: number;
    totalMissileBases: number;
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
        totalAbmBases: 0,
        totalRadarBases: 0,
        totalAirBases: 0,
        totalArmyBases: 0,
        totalNavyBases: 0,
        totalMissileBases: 0,
        targetedMapLocations: [],
        totalAbmMissilesOnLine: 0,
        totalICBMsOnLine: 0,
        totalSubMissilesOnLine: 0,
        totalPassiveRadarStationsOnLine: 0,
        totalActiveRadarStationsOnLine: 0,
        totalBombersInFlight: 0,
        totalFightersOnPatrol: 0
        }


    public static GetMapLocationSingleCharacterCode(args: { forMapLocation: MapLocation }) {

        if (args.forMapLocation.Contents === null) {
            return "Empty";
        }

        switch (args.forMapLocation.Contents.WorldObjectLabel) {
            case "ABM": return "ABM";
            case "Air": return "Air";
            case "Army": return "Army";
            case "City": return "City";
            case "Missile": return "Msl";
            case "Navy": return "Nvy";
            case "Radar": return "Rdr";
            case "Rural": return ".";
            case "Town": return "Town";
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

        const isPassiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperaton === "Passive";
        const isActiveRader = (loc: MapLocation) => MapUtil.isRadarBase(loc) && (loc.Contents as RadarBase).modeOfOperaton === "Active";

        const addLocationToSummary = (l: MapLocation, s: countrySummary) =>
            l.Contents
                ? (
                    {
                        totalAbmBases: MapUtil.isAbmBase(l) ? s.totalAbmBases += 1 : s.totalAbmBases,
                        totalAbmMissilesOnLine: MapUtil.isAbmBase(l) ? s.totalAbmMissilesOnLine += (l.Contents as AbmBase).totalMissiles : s.totalAbmMissilesOnLine,
                        totalRadarBases: MapUtil.isRadarBase(l) ? s.totalRadarBases += 1 : s.totalRadarBases,
                        totalPassiveRadarStationsOnLine: isPassiveRader(l) ? s.totalPassiveRadarStationsOnLine += 1 : s.totalPassiveRadarStationsOnLine,
                        totalActiveRadarStationsOnLine: isActiveRader(l) ? s.totalActiveRadarStationsOnLine += 1 : s.totalActiveRadarStationsOnLine,
                        totalArmyBases: MapUtil.isArmyBase(l) ? s.totalArmyBases += 1 : s.totalArmyBases,
                        totalAirBases: MapUtil.isAirBase(l) ? s.totalAirBases += 1 : s.totalAirBases,
                        totalBombersInFlight: MapUtil.isAirBase(l) ? s.totalBombersInFlight += (l.Contents as AirBase).ordnance.length : s.totalBombersInFlight,
                        totalFightersOnPatrol: MapUtil.isAirBase(l) ? s.totalFightersOnPatrol += (l.Contents as AirBase).totalFighters : s.totalFightersOnPatrol,
                        totalMissileBases: MapUtil.isMissileBase(l) ? s.totalMissileBases += 1 : s.totalMissileBases,
                        totalICBMsOnLine: MapUtil.isMissileBase(l) ? s.totalICBMsOnLine += (l.Contents as MissileBase).ordnance.length : s.totalICBMsOnLine,
                        totalNavyBases: MapUtil.isNavyBase(l) ? s.totalNavyBases += 1 : s.totalNavyBases,
                        totalSubMissilesOnLine: MapUtil.isNavyBase(l) ? s.totalSubMissilesOnLine += (l.Contents as NavyBase).ordnance.length : s.totalSubMissilesOnLine,
                        targetedMapLocations: l.isTargeted ? s.targetedMapLocations.concat(l) : s.targetedMapLocations
                    } as countrySummary
                )
                : s
            ;

        const mapRowSummary = (row: MapLocation[]) =>
            row.reduce((prev, curr) => addLocationToSummary(curr, prev), this.initialSummary);

        const addTwoSummaries = (s1: countrySummary, s2: countrySummary) => (
            {
                totalAbmBases: s1.totalAbmBases + s2.totalAbmBases,
                totalAbmMissilesOnLine: s1.totalAbmMissilesOnLine + s2.totalAbmMissilesOnLine,
                totalRadarBases: s1.totalRadarBases + s2.totalRadarBases,
                totalAirBases: s1.totalAirBases + s2.totalAirBases,
                totalArmyBases: s1.totalArmyBases + s2.totalArmyBases,
                totalMissileBases: s1.totalMissileBases + s2.totalMissileBases,
                totalNavyBases: s1.totalNavyBases + s2.totalNavyBases,
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

        console.log(`MapUtils: getMapSummary: allIn:`, { allIn2: allIn });

        return allIn;
    }

}