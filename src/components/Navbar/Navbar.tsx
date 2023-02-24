import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
    return (
        <nav>
            <Link to="/">Strona główna</Link>
            <Link to="/Map">Mapa</Link>
        </nav>
    );
};
