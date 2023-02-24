import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import H from "@here/maps-api-for-javascript";
import { HashLoader } from "react-spinners";
import { RouteHistoryRecord, CoordinateWaypoint } from "../../types";
import "leaflet/dist/leaflet.css";
import "./MapDisplayer.css";
import { RoutingMachine } from "../../components/RoutingMachine/RoutingMachine";
import { isValidError } from "../../utils";
import { RoutingResults } from "../../components/RoutingResults/RoutingResults";

interface MapDisplayerProps {
    routeToDisplay: RouteHistoryRecord;
}

const platform = new H.service.Platform({
    apikey: "6DCiwlupOp-w0eHvPir2tNVGC4goVN8Jxsbo5trfnt4",
});

export const MapDisplayer: React.FC<MapDisplayerProps> = ({ routeToDisplay }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [codedCoords, setCodedCoords] = useState<[CoordinateWaypoint, CoordinateWaypoint] | null | Error>(null);
    const [totalDistance, setTotalDistance] = useState<number | null>(null);

    useEffect(() => {
        if (!routeToDisplay.from || !routeToDisplay.to) { return; }
        setIsLoading(true);
        try {
            const hereService = platform.getSearchService();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hereService.geocode({ q: routeToDisplay.from }, (firstResults: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                hereService.geocode({ q: routeToDisplay.to }, (secondResults: any) => {
                    setCodedCoords(
                        // HERE api have type Object for results so it throws many errors in typescript
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        [firstResults.items[0].position as CoordinateWaypoint, secondResults.items[0].position as CoordinateWaypoint],
                    );
                }, (err) => { throw new Error(`${err}`); });
            }, (error) => { throw new Error(`${error}`); });
        } catch (err) {
            setCodedCoords(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [routeToDisplay]);

    return (
        <main className="mainMap">
            <div className="mapWrapper">
                {!isLoading && (!isValidError(codedCoords) || codedCoords !== null) ? (
                    <>
                        <div className="mapContainer">

                            <MapContainer
                                doubleClickZoom={false}
                                id="mapId"
                                zoom={7}
                                center={[52.2, 21]}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {codedCoords && !isValidError(codedCoords) && (
                                    <RoutingMachine
                                        startingWaypoint={
                                            { lat: codedCoords[0].lat, lng: codedCoords[0].lng, address: routeToDisplay.from }
                                        }
                                        endingWaypoint={{ lat: codedCoords[0].lat, lng: codedCoords[1].lng, address: routeToDisplay.to }}
                                        getKilometers={setTotalDistance}
                                    />
                                )}
                            </MapContainer>
                        </div>
                        {totalDistance && (
                            <RoutingResults
                                totalDistance={totalDistance}
                                startingAddress={routeToDisplay.from}
                                endingAddress={routeToDisplay.to}
                            />
                        )}
                    </>
                ) : <HashLoader loading={true} size={100} />}
            </div>
        </main>
    );
};
