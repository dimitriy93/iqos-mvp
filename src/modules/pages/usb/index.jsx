import { observer } from "mobx-react-lite";
import { usbStore } from "@/app/store/usb/usb.store.js";

export const UsbPage = observer(() => {
    const {
        deviceInfo,
        interfaces,
        endpoints,
        isConnected,
        isLoading,
        error,
        isUsbSupported
    } = usbStore;

    return (
        <div className="container iqos-container mt-5">
            <h1 className="iqos-title">USB подключение</h1>
            <p className="iqos-subtitle">
                Подключение USB-устройств через WebUSB API
            </p>

            {!isUsbSupported && (
                <div className="alert alert-danger">
                    WebUSB API не поддерживается этим браузером
                </div>
            )}

            <div className="iqos-card">
                <div className="iqos-card-header">
                    Управление подключением
                </div>

                <div className="iqos-card-body">
                    <div className="d-flex gap-3 mb-4">
                        <button
                            className="iqos-btn-primary"
                            disabled={isLoading || !isUsbSupported}
                            onClick={() => usbStore.connectDevice()}
                        >
                            {isLoading ? "Подключение..." : "Подключить USB устройство"}
                        </button>

                        {isConnected && (
                            <button
                                className="iqos-btn-outline"
                                onClick={() => usbStore.disconnectDevice()}
                            >
                                Отключить
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                            <button
                                className="btn-close float-end"
                                onClick={() => usbStore.clearError()}
                            />
                        </div>
                    )}

                    {deviceInfo && (
                        <div className="iqos-info-box">
                            <p><strong>Производитель:</strong> {deviceInfo.manufacturerName}</p>
                            <p><strong>Продукт:</strong> {deviceInfo.productName}</p>
                            <p><strong>Vendor ID:</strong> {deviceInfo.vendorId}</p>
                            <p><strong>Product ID:</strong> {deviceInfo.productId}</p>
                        </div>
                    )}
                </div>
            </div>

            {interfaces.length > 0 && (
                <div className="iqos-card mt-4">
                    <div className="iqos-card-header">
                        Интерфейсы
                    </div>

                    <div className="iqos-card-body">
                        <ul className="list-group">
                            {interfaces.map((iface, i) => (
                                <li key={i} className="list-group-item">
                                    Интерфейс №{iface.interfaceNumber} — alternates: {iface.alternates}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {endpoints.length > 0 && (
                <div className="iqos-card mt-4">
                    <div className="iqos-card-header">
                        Endpoints
                    </div>

                    <div className="iqos-card-body">
                        <table className="table table-sm">
                            <thead>
                            <tr>
                                <th>Interface</th>
                                <th>Endpoint</th>
                                <th>Direction</th>
                                <th>Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {endpoints.map((ep, i) => (
                                <tr key={i}>
                                    <td>{ep.interfaceNumber}</td>
                                    <td>{ep.endpointNumber}</td>
                                    <td>{ep.direction}</td>
                                    <td>{ep.type}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
});