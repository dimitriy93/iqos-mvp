import {makeAutoObservable, runInAction} from "mobx";

class BluetoothStore {
    device = null;
    server = null;
    characteristics = [];
    deviceInfo = null;
    isLoading = false;
    error = null;
    readingValues = {};
    isConnected = false;

    serviceUuids = [
        '58361e6d-e579-1df8-8997-50aa66a3add0',
        '664578b6-c390-42d8-956e-c1ae8b646436',
        'daebb240-b041-11e4-9e45-0002a5d5c51b',
    ];

    constructor() {
        makeAutoObservable(this);
    }

    get isBluetoothSupported() {
        return !!navigator.bluetooth;
    }

    decodeBuffer(buffer, encoding = 'utf-8') {
        try {
            if (!buffer || buffer.byteLength === 0) {
                return 'Пустое значение';
            }
            return new TextDecoder(encoding).decode(buffer);
        } catch (err) {
            return `Ошибка декодирования: ${err.message}`;
        }
    }

    async requestDevice() {
        if (!this.isBluetoothSupported) {
            runInAction(() => {
                this.error = 'Web Bluetooth API не поддерживается';
            });
            return;
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true
            });

            runInAction(() => {
                this.device = device;
                this.deviceInfo = {
                    id: device.id,
                    name: device.name
                };
            });

        } catch (err) {
            runInAction(() => {
                this.error = `Ошибка выбора устройства: ${err.message}`;
            });
        }
    }

    async connectDevice() {
        if (!this.isBluetoothSupported) {
            runInAction(() => {
                this.error = 'Web Bluetooth API не поддерживается вашим браузером';
            });
            return;
        }

        runInAction(() => {
            this.isLoading = true;
            this.error = null;
            this.characteristics = [];
            this.deviceInfo = null;
            this.readingValues = {};
        });

        try {
            const devices = await navigator.bluetooth.getDevices();
            const device = devices.find(d => d.id === this.deviceInfo.id);

            if (!device) {
                throw new Error('Устройство не найдено среди разрешённых');
            }

            const server = await device.gatt.connect();

            runInAction(() => {
                this.device = device;
                this.server = server;
                this.isConnected = true;
            });

            for (const uuid of this.serviceUuids) {
                try {
                    const service = await server.getPrimaryService(uuid);
                    const chars = await service.getCharacteristics();

                    runInAction(() => {
                        this.characteristics.push(...chars);
                    });

                } catch {
                }
            }

        } catch (err) {
            runInAction(() => {
                this.error = `Ошибка подключения: ${err.message}`;
                this.isConnected = false;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    disconnectDevice() {
        if (this.device?.gatt?.connected) {
            this.device.gatt.disconnect();
        }

        runInAction(() => {
            this.device = null;
            this.server = null;
            this.characteristics = [];
            this.readingValues = {};
            this.isConnected = false;
        });
    }

    async readCharacteristic(characteristic, index) {
        if (!characteristic.properties.read) {
            runInAction(() => {
                this.readingValues[index] = 'Чтение не поддерживается';
            });
            return;
        }

        runInAction(() => {
            this.readingValues[index] = 'Чтение...';
        });

        try {
            const value = await characteristic.readValue();
            const decoded = this.decodeBuffer(value);

            runInAction(() => {
                this.readingValues[index] = decoded;
            });

        } catch (err) {
            runInAction(() => {
                this.readingValues[index] = `Ошибка: ${err.message}`;
            });
        }
    }

    async readAllCharacteristics() {
        for (let i = 0; i < this.characteristics.length; i++) {
            const char = this.characteristics[i];
            if (char.properties.read) {
                await this.readCharacteristic(char, i);
            }
        }
    }

    clearError() {
        this.error = null;
    }
}

export const bluetoothStore = new BluetoothStore();