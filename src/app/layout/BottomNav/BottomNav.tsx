import { NavLink } from "react-router-dom";
import "./bottom-nav.css";

export const BottomNav = () => {
    return (
        <nav className="bottom-nav d-lg-none">
            <NavLink to="/iqos" className="bottom-nav__item">
                <span className="bottom-nav__label">IQOS</span>
            </NavLink>

            <NavLink to="/bluetooth" className="bottom-nav__item">
                <span className="bottom-nav__label">Bluetooth</span>
            </NavLink>

            <NavLink to="/usb" className="bottom-nav__item">
                <span className="bottom-nav__label">USB</span>
            </NavLink>
        </nav>
    );
};
