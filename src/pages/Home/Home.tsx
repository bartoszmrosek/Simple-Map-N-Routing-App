import React, { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MapRoute } from "../../components/MapRoute/MapRoute";
import { RouteHistoryRecord } from "../../types";
import "./Home.css";

interface HomeProps {
    addNewHistoryEntry: (entry: RouteHistoryRecord) => void;
    setRouteFromHistory: (id: string) => void;
    setRouteToDisplay: (route: RouteHistoryRecord) => void;
    mapRoutesHistory: RouteHistoryRecord[];
}

export const Home: React.FC<HomeProps> = ({ addNewHistoryEntry, setRouteFromHistory, setRouteToDisplay, mapRoutesHistory }) => {
    const [fromInputValue, setFromInputValue] = useState<string>("");
    const [toInputValue, setToInputValue] = useState<string>("");
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const route = { id: uuidv4(), to: toInputValue, from: fromInputValue };
        setRouteToDisplay(route);
        addNewHistoryEntry(route);
        setFromInputValue("");
        setToInputValue("");
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
        <main className="homepage">
            <div className="mainContainer">
                <form onSubmit={handleSubmit} className="addressForm">
                    <label htmlFor="fromInput">Adres początkowy</label>
                    <input
                        id="fromInput"
                        value={fromInputValue}
                        placeholder="Adres poczatkowy"
                        onChange={handleInput}
                        required={true}
                    />
                    <label htmlFor="toInput">Adres docelowy</label>
                    <input
                        id="toInput"
                        value={toInputValue}
                        placeholder="Adres docelowy"
                        onChange={handleInput}
                        required={true}
                    />
                    <button
                        ref={btnRef}
                        type="submit"
                        className="formSubmitBtn"
                        disabled={!fromInputValue || !toInputValue}
                        data-testid="routeSetter"
                    >Ustaw trasę
                    </button>
                </form>
                {mapRoutesHistory.length > 0 && (
                    <div className="historyWrapper">
                        <h1>Historia tras</h1>
                        {mapRoutesHistory.map((route, index) => (
                            <MapRoute
                                key={route.id}
                                index={index}
                                route={route}
                                setRouteFromHistory={setRouteFromHistory}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};
