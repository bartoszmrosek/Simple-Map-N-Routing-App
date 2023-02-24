import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useCallback, useState } from "react";
import { font } from "./PDFFont";
import "./RoutingResults.css";

interface RoutingResultsProps {
    totalDistance: number;
    startingAddress: string;
    endingAddress: string;
}

export const RoutingResults: React.FC<RoutingResultsProps> = ({ totalDistance, startingAddress, endingAddress }) => {
    const [kilometerCost, setKilometerCost] = useState(0.8);
    const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget.value) { return setKilometerCost(0); }
        setKilometerCost(parseFloat(e.currentTarget.value));
    }, []);

    const kilometers = totalDistance / 1000;
    const calculatedTime = kilometerCost > 0.8 ? kilometers / (1000 / kilometerCost) : (kilometers / 800);
    const calulatedCost = ((kilometerCost * kilometers) * 1.1).toFixed(2);

    const handleSave = useCallback(() => {
        const table = document.querySelector(".leaflet-routing-alt>table") as HTMLTableElement;
        if (!table) { return; }
        const doc = new JsPDF();
        doc.setLanguage("pl");
        doc.addFileToVFS("Libre.tff", font);
        doc.addFont("Libre.tff", "Libre", "normal");
        doc.setFont("Libre");

        doc.text([`Dane trasy:`,
        `Adres poczatkowy: ${startingAddress}`,
        `Adres koncowy: ${endingAddress}`,
        `Ilosc kilometrow: ${kilometers}`,
        `Czas podrozy: ${calculatedTime < 1 ? "ponizej dnia" : `${calculatedTime.toFixed(2)}
                        ${calculatedTime < 2 ? "dnia" : "dni"}`}`,
        `Koszt podrozy: ${calulatedCost} zl`,
        `Kroki:`,
        ], 10, 10);
        autoTable(doc, { html: table, startY: 60, theme: "grid", styles: { font: "Libre" } });
        doc.save("Trasa.pdf");
    }, [calculatedTime, calulatedCost, endingAddress, kilometers, startingAddress]);

    return (
        <div className="routingResults">
            <label htmlFor="kmCost">Koszt za kilometr</label>
            <span className="inputCurrency">
                <input id="kmCost" value={`${kilometerCost}`} onChange={handleInput} placeholder="cena za kilometr" type="number" />
            </span>
            <div className="currentStatistics">
                <p>Ilość kilometrów: {kilometers.toFixed(2)} km</p>
                {kilometerCost > 0 ? (
                    <>
                        <p>Czas podróży: {
                        calculatedTime < 1 ? "poniżej dnia" : `${calculatedTime.toFixed(2)}
                        ${calculatedTime < 2 ? "dnia" : "dni"}`}
                        </p>
                        <p>Obecny koszt: {calulatedCost} zł</p>
                        <button onClick={handleSave} className="downloadPdfBtn">Pobierz pdf</button>
                    </>
                ) : <p>Dane niedostępne z powodu braku ceny</p>
            }
            </div>
        </div>
    );
};
