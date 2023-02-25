import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Home } from "./Home";

const startingAddress = "Władysława Andersa 5, 41-103 Siemianowice Śląskie";
const endingAddress = "Wyzwolenia 16, 41-103 Siemianowice Śląskie";
const defaultMock = vi.fn();

describe("Home", () => {
    test("saves and displayes new route", async () => {
        const historyStore: any[] = [];
        const addNewHistoryMock = vi.fn((route) => historyStore.push(route));
        const { rerender } = render(<Home
            addNewHistoryEntry={addNewHistoryMock}
            setRouteFromHistory={defaultMock}
            setRouteToDisplay={defaultMock}
            mapRoutesHistory={historyStore}
        />);
        const startInput = screen.getByPlaceholderText("Adres poczatkowy");
        const endingInput = screen.getByPlaceholderText("Adres docelowy");
        const user = userEvent.setup();
        await act(async () => {
            await user.type(startInput, startingAddress);
            await user.type(endingInput, endingAddress);
            await user.click(screen.getByTestId("routeSetter"));
        });
        expect(historyStore).toHaveLength(1);
        rerender(<Home
            addNewHistoryEntry={defaultMock}
            setRouteFromHistory={defaultMock}
            setRouteToDisplay={defaultMock}
            mapRoutesHistory={historyStore}
        />);
        expect(startInput).toHaveValue("");
        expect(endingInput).toHaveValue("");
        expect(document.querySelectorAll("button.historyItem")[0].textContent).toEqual(`Trasa 0${startingAddress}${endingAddress}`);
    });
    test("click won`t do anything if inputs are empty", async () => {
        const historyStore: any[] = [];
        const addNewHistoryMock = vi.fn((route) => historyStore.push(route));
        render(<Home
            addNewHistoryEntry={addNewHistoryMock}
            setRouteFromHistory={defaultMock}
            setRouteToDisplay={defaultMock}
            mapRoutesHistory={historyStore}
        />);
        const user = userEvent.setup();
        await act(async () => {
            await user.click(screen.getByTestId("routeSetter"));
        });
        expect(historyStore).toHaveLength(0);
    });
    test("can set route with click on history record", async () => {
        const routeFromHistory = vi.fn();
        const user = userEvent.setup();
        const route = { id: "a", from: startingAddress, to: endingAddress };
        render(<Home
            setRouteFromHistory={routeFromHistory}
            setRouteToDisplay={defaultMock}
            addNewHistoryEntry={defaultMock}
            mapRoutesHistory={[route]}
        />);
        const historyRouteBtn = document.querySelectorAll("button.historyItem")[0];
        expect(historyRouteBtn.textContent).toEqual(`Trasa 0${startingAddress}${endingAddress}`);
        await act(async () => {
            await user.click(historyRouteBtn);
        });
        expect(routeFromHistory).toBeCalledWith(route.id);
    });
});
