import { observer } from 'mobx-react-lite';
import {bluetoothStore} from "@/app/store/bluetooth/bluetooth.store.js";
import "./bluetooth-page.css"

export const BluetoothPage = observer(() => {
    const {
        deviceInfo,
        characteristics,
        isLoading,
        error,
        readingValues,
        isConnected,
        isBluetoothSupported
    } = bluetoothStore;

    const handleConnect = () => {
        bluetoothStore.connectDevice();
    };

    const handleDisconnect = () => {
        bluetoothStore.disconnectDevice();
    };

    const handleReadAll = () => {
        bluetoothStore.readAllCharacteristics();
    };

    const handleReadCharacteristic = (characteristic, index) => {
        bluetoothStore.readCharacteristic(characteristic, index);
    };

    return (
        <div className="container iqos-container mt-5">
            <h1 className="iqos-title">Подключение по Bluetooth</h1>
            <p className="iqos-subtitle">
                Подключитесь к Bluetooth устройству
            </p>

            {!isBluetoothSupported && (
                <div className="alert alert-danger">
                    <h5>Web Bluetooth API не поддерживается</h5>
                    <p className="mb-0">
                        Ваш браузер не поддерживает Web Bluetooth API.
                        Используйте Chrome, Edge, или Opera последних версий.
                    </p>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Управление подключением</h5>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-3 mb-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleConnect}
                            disabled={isLoading || !isBluetoothSupported}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Подключение...
                                </>
                            ) : 'Подключиться к устройству'}
                        </button>

                        {isConnected && (
                            <>
                                <button
                                    className="btn btn-success"
                                    onClick={handleReadAll}
                                    disabled={characteristics.length === 0}
                                >
                                    Прочитать все характеристики
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleDisconnect}
                                >
                                    Отключиться
                                </button>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <strong>Ошибка:</strong> {error}
                            <button
                                className="btn-close float-end"
                                onClick={() => bluetoothStore.clearError()}
                            ></button>
                        </div>
                    )}

                    {deviceInfo && (
                        <div className="alert alert-info">
                            <h6>Информация об устройстве:</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="mb-1"><strong>ID:</strong> {deviceInfo.id}</p>
                                    <p className="mb-1"><strong>Название:</strong> {deviceInfo.name}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1">
                                        <strong>Статус:</strong>
                                        <span className={`badge ms-2 ${isConnected ? 'bg-success' : 'bg-danger'}`}>
                                            {isConnected ? 'Подключено' : 'Отключено'}
                                        </span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Характеристики:</strong> {characteristics.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {characteristics.length > 0 && (
                // <BluetoothCard characteristics={characteristics} readingValues={readingValues} handleReadCharacteristic={handleReadCharacteristic}/>
                <div className="card">
                    <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Характеристики устройства</h5>
                        <span className="badge bg-light text-dark">
                            {characteristics.length} характеристик
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>UUID</th>
                                    <th>Свойства</th>
                                    <th>Значение</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {characteristics.map((char, index) => (
                                    <tr key={`${char.uuid}-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <code className="small" title={char.uuid}>
                                                {char.uuid.length > 20
                                                    ? `${char.uuid.substring(0, 20)}...`
                                                    : char.uuid}
                                            </code>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {char.properties.read && (
                                                    <span className="badge bg-success">read</span>
                                                )}
                                                {char.properties.write && (
                                                    <span className="badge bg-warning text-dark">write</span>
                                                )}
                                                {char.properties.notify && (
                                                    <span className="badge bg-info">notify</span>
                                                )}
                                                {!char.properties.read && !char.properties.write && !char.properties.notify && (
                                                    <span className="badge bg-secondary">none</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{maxWidth: '300px'}}>
                                            {readingValues[index] ? (
                                                <div className="characteristic-value p-2 bg-light rounded">
                                                    <code className="small">
                                                        {readingValues[index]}
                                                    </code>
                                                </div>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                {char.properties.read && (
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleReadCharacteristic(char, index)}
                                                        disabled={readingValues[index] === 'Чтение...'}
                                                        title="Прочитать значение"
                                                    >
                                                        {readingValues[index] === 'Чтение...' ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : 'Прочитать'}
                                                    </button>
                                                )}
                                                {char.properties.write && (
                                                    <button
                                                        className="btn btn-outline-error"
                                                        disabled
                                                        title="Записать значение"
                                                    >
                                                        Прочтение невозможно
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {characteristics.length === 0 && !isLoading && isBluetoothSupported && (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <h5 className="text-muted">Устройство не подключено</h5>
                        <p className="text-muted">
                            Нажмите "Подключиться к устройству" для начала работы с Bluetooth
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
});