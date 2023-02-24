import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar: React.FC = () => {
    const currentClassnames = useCallback(({ isActive }: { isActive: boolean; }) => {
        return isActive ? "selected navigationLink" : "navigationLink";
    }, []);
    return (
        <nav className="navigation">
            <NavLink to="/" className={currentClassnames}>Strona główna</NavLink>
            <NavLink to="/Map" className={currentClassnames}>Mapa</NavLink>
        </nav>
    );
};
