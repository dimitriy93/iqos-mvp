import {NavLink} from "react-router-dom";
import "./top-nav.css";

export const TopNav = () => {
    return (
        <nav className="top-nav d-none d-lg-block">
            <div className="top-nav__container container">
                <div className="top-nav__brand">
                    IQOS
                </div>

                <div className="top-nav__menu">
                    <NavLink to="/iqos" className="top-nav__link">
                        IQOS
                    </NavLink>

                    <NavLink to="/bluetooth" className="top-nav__link">
                        Bluetooth
                    </NavLink>

                    <NavLink to="/usb" className="top-nav__link">
                        USB
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}