import { createControlComponent } from "@react-leaflet/core";
import * as L from "leaflet";
import { CoordinateWaypoint } from "../../types";
// eslint-disable-next-line import/no-unassigned-import
import "leaflet-routing-machine";

interface CreateRoutingMachineLayerProps {
    startingWaypoint: CoordinateWaypoint & { address: string; };
    endingWaypoint: CoordinateWaypoint & { address: string; };
    getKilometers: React.Dispatch<React.SetStateAction<number | null>>;
}

const blueIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const redIcon = new L.Icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const createRoutingMachineLayer = ({
    startingWaypoint,
    endingWaypoint,
    getKilometers,
}: L.ControlOptions & CreateRoutingMachineLayerProps) => {
    const instance = L.Routing.control({
        waypoints: [
            L.latLng(startingWaypoint.lat, startingWaypoint.lng),
            L.latLng(endingWaypoint.lat, endingWaypoint.lng),
        ],
        // not sure why typescript has problem with it, probably types are wrong for package
        language: "pl",
        createMarker: (i: number, wp: L.Routing.Waypoint, nth: number) => {
            if (i === nth - 1) {
                return L.marker(wp.latLng, { icon: redIcon, riseOnHover: true })
                    .bindTooltip(`Adres docelowy: ${endingWaypoint.address}`);
            }
            return L.marker(wp.latLng, { icon: blueIcon, riseOnHover: true })
                .bindTooltip(`Adres startowy: ${startingWaypoint.address}`);
        },
        lineOptions: { extendToWaypoints: true, missingRouteTolerance: 1, styles: [{ color: "blue", weight: 3 }] },
        addWaypoints: false,
        routeWhileDragging: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        summaryTemplate: "<h2>{name}</h2><h3>{distance}</h3>",
        containerClassName: "routingControl",
    } as L.Routing.RoutingControlOptions);
    instance.on("routesfound", (event: { routes: { summary: { totalDistance: number; }; }[]; }) => {
        const routes = event.routes;
        if (routes[0]) {
            getKilometers(routes[0].summary.totalDistance);
        }
    });
    return instance;
};

export const RoutingMachine = createControlComponent(createRoutingMachineLayer);
