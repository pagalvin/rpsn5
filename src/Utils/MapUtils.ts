import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";

export interface countrySummary {
    totalAbmBases: number;
    totalRadarBases: number;
    totalArmyBases: number;
    totalNavyBases: number;
    totalAirBases: number;
    totalMissileBases: number;
    targetedMapLocations: MapLocation[];
}

export class MapUtil {

    private static readonly initialSummary: countrySummary = {
        totalAbmBases: 0,
        totalRadarBases: 0,
        totalAirBases: 0,
        totalArmyBases: 0,
        totalNavyBases: 0,
        totalMissileBases: 0,
        targetedMapLocations: []
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


    public static getMapSummary(args: { forMap: CountryMap }) {

        const addLocationToSummary = (l: MapLocation, s: countrySummary) =>
            l.Contents
                ? (
                    {
                        totalAbmBases: l.Contents.WorldObjectLabel === "ABM" ? s.totalAbmBases += 1 : s.totalAbmBases,
                        totalRadarBases: l.Contents.WorldObjectLabel === "Radar" ? s.totalRadarBases += 1 : s.totalRadarBases,
                        totalArmyBases: l.Contents.WorldObjectLabel === "Army" ? s.totalArmyBases += 1 : s.totalArmyBases,
                        totalAirBases: l.Contents.WorldObjectLabel === "Air" ? s.totalAirBases += 1 : s.totalAirBases,
                        totalMissileBases: l.Contents.WorldObjectLabel === "Missile" ? s.totalMissileBases += 1 : s.totalMissileBases,
                        totalNavyBases: l.Contents.WorldObjectLabel === "Navy" ? s.totalNavyBases += 1 : s.totalNavyBases,
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
                totalRadarBases: s1.totalRadarBases + s2.totalRadarBases,
                totalAirBases: s1.totalAirBases + s2.totalAirBases,
                totalArmyBases: s1.totalArmyBases + s2.totalArmyBases,
                totalMissileBases: s1.totalMissileBases + s2.totalMissileBases,
                totalNavyBases: s1.totalNavyBases + s2.totalNavyBases,
                targetedMapLocations: s1.targetedMapLocations.concat(s2.targetedMapLocations)
            } as countrySummary
        );

        const allIn = args.forMap.map.reduce(
            (prev, curr) => addTwoSummaries(prev, mapRowSummary(curr)), this.initialSummary
        );

        // console.log(`MapUtils: getMapSummary: allIn:`, { allIn2: allIn });

        return allIn;
    }

}