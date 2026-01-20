import {Navigate, Route, Routes} from "react-router-dom";
import {IqosPage} from "@/modules/pages/iqos";
import {BluetoothPage} from "@/modules/pages/bluetooth";
import {UsbPage} from "@/modules/pages/usb";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/iqos" replace />} />

            <Route path="/iqos" element={<IqosPage />}/>
            <Route path="/bluetooth" element={<BluetoothPage />}/>
            <Route path="/usb" element={<UsbPage />}/>

            <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
    )
}