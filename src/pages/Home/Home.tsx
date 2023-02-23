import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MapRoute } from "../../components/MapRoute/MapRoute";
import { RouteHistoryRecord } from "../../types";

interface HomeProps {
    addNewHistoryEntry: (entry: RouteHistoryRecord) => void;
    setRouteFromHistory: (id: string) => void;
    setRouteToDisplay: (route: RouteHistoryRecord) => void;
    mapRoutesHistory: RouteHistoryRecord[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Home: React.FC<HomeProps> = ({ addNewHistoryEntry, setRouteFromHistory, setRouteToDisplay, mapRoutesHistory }) => {
    const [fromInputValue, setFromInputValue] = useState<string>("");
    const [toInputValue, setToInputValue] = useState<string>("");

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const route = { id: uuidv4(), to: toInputValue, from: fromInputValue };
        setRouteToDisplay(route);
        addNewHistoryEntry(route);
    }, [addNewHistoryEntry, fromInputValue, setRouteToDisplay, toInputValue]);

    const handleInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            switch (e.currentTarget.id) {
                case "fromInput":
                    return setFromInputValue(e.currentTarget.value);
                case "toInput":
                    return setToInputValue(e.currentTarget.value);
            }
            throw new Error("Input id not found");
        }, [],
    );

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fromInput">Starting address:</label>
                <input
                    id="fromInput"
                    value={fromInputValue}
                    placeholder="Write starting address here"
                    onChange={handleInput}

                />
                <label htmlFor="toInput">Destination address:</label>
                <input
                    id="toInput"
                    value={toInputValue}
                    placeholder="Write destination address here"
                    onChange={handleInput}
                    title="Address should contain: "
                />
                <button type="submit">Submit</button>
            </form>
            <div className="historyWrapper">
                {mapRoutesHistory.map((route) => <MapRoute key={route.id} route={route} setRouteFromHistory={setRouteFromHistory} />)}
            </div>
        </main>
    );
};
