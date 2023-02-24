import React, { useCallback } from "react";
import { RouteHistoryRecord } from "../../types";
import "./MapRoute.css";

interface MapRouteProps {
    route: RouteHistoryRecord;
    setRouteFromHistory: (id: string) => void;
    index: number;
}

export const MapRoute: React.FC<MapRouteProps> = ({ route, setRouteFromHistory, index }) => {
    const handleClick = useCallback(() => {
        setRouteFromHistory(route.id);
    }, [route.id, setRouteFromHistory]);
    return (
        <button onClick={handleClick} className="historyItem">
            <h2>Trasa {index}</h2>
            {route.from}
            <span className="arrow" />
            {route.to}
        </button>
    );
};
