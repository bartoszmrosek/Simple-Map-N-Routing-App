import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import H from "@here/maps-api-for-javascript";
import { RouteHistoryRecord, CoordinateWaypoint } from "../../types";
import "leaflet/dist/leaflet.css";
import "./MapDisplayer.css";
import { RoutingMachine } from "../../components/RoutingMachine/RoutingMachine";

interface MapDisplayerProps {
    routeToDisplay: RouteHistoryRecord;
}

const platform = new H.service.Platform({
    apikey: "6DCiwlupOp-w0eHvPir2tNVGC4goVN8Jxsbo5trfnt4",
});

export const MapDisplayer: React.FC<MapDisplayerProps> = ({ routeToDisplay }) => {
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [codedCoords, setCodedCoords] = useState<[CoordinateWaypoint, CoordinateWaypoint] | null | Error>(null);

    useEffect(() => {
        if (!routeToDisplay.from || !routeToDisplay.to) { return; }
        setIsLoading(true);
        try {
            const hereService = platform.getSearchService();
            hereService.geocode({ q: routeToDisplay.from }, (firstResults) => {
                hereService.geocode({ q: routeToDisplay.to }, (secondResults) => {
                    setCodedCoords(
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        [firstResults.items[0].position as CoordinateWaypoint, secondResults.items[0].position as CoordinateWaypoint],
                    );
                }, (err) => { throw new Error(`${err}`); });
            }, (error) => { throw new Error(`${error}`); });
        } catch (err) {
            setCodedCoords(err as Error);
        }
    }, [routeToDisplay]);

    console.log(codedCoords);
    return (
        <main>
            {routeToDisplay.from} to: {routeToDisplay.to}
            <div className="mapWrapper">
                {codedCoords !== null || !isLoading && (
                    <MapContainer doubleClickZoom={false} id="mapId" zoom={7} center={[52.2, 21]} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RoutingMachine
                            startingWaypoint={{ lat: 50.31943335077848, lng: 19.00325770377468 }}
                            endingWaypoint={{ lat: 50.34739583924648, lng: 18.981784221261226 }}
                        />
                    </MapContainer>
                )}
            </div>
        </main>
    );
};
