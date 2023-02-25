import React, { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Navbar } from "./components/Navbar/Navbar";
import { Home } from "./pages/Home/Home";
import { MapDisplayer } from "./pages/MapDisplayer/MapDisplayer";
import { RouteHistoryRecord } from "./types";

export const App: React.FC = () => {
    const [mapRoutesHistory, setMapRoutesHistory] = useState<RouteHistoryRecord[]>([]);
    const [routeToDisplay, setNewRouteToDisplay] = useState<RouteHistoryRecord>({ id: uuidv4(), from: "", to: "" });

    const addNewHistoryEntry = useCallback((entry: RouteHistoryRecord) => {
        setMapRoutesHistory(history => [...history, entry]);
    }, []);

    const setRouteFromHistory = useCallback((id: string) => {
        const searchRes = mapRoutesHistory.find((route) => route.id === id);
        if (searchRes) { setNewRouteToDisplay(searchRes); }
    }, [mapRoutesHistory]);

    const setRouteToDisplay = useCallback((route: RouteHistoryRecord) => {
        setNewRouteToDisplay(route);
    }, []);

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/Simple-Map-N-Routing-App/"
                    element={(
                        <Home
                            addNewHistoryEntry={addNewHistoryEntry}
                            setRouteFromHistory={setRouteFromHistory}
                            setRouteToDisplay={setRouteToDisplay}
                            mapRoutesHistory={mapRoutesHistory}
                        />
                    )}
                />
                <Route path="Map/*" element={<MapDisplayer routeToDisplay={routeToDisplay} />} />
                <Route path="*" element={<Navigate to="/Simple-Map-N-Routing-App/" replace={true} />} />
            </Routes>
        </>
    );
};
