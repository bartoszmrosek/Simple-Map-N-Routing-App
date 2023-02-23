import React, { useCallback } from "react";
import { RouteHistoryRecord } from "../../types";

interface MapRouteProps {
    route: RouteHistoryRecord;
    setRouteFromHistory: (id: string) => void;
}

export const MapRoute: React.FC<MapRouteProps> = ({ route, setRouteFromHistory }) => {
    const handleClick = useCallback(() => {
        setRouteFromHistory(route.id);
    }, [route.id, setRouteFromHistory]);
    return (
        <button onClick={handleClick}>
            Btn: {route.from}, {route.to}
        </button>
    );
};
