import { makeAutoObservable, runInAction } from "mobx";

class BluetoothStore {
    device = null;
    server = null;
    service = null;
    characteristics = [];
    permittedDevices = [];
    isConnected = false;
    isLoading = false;
    error = null;
    serviceUUID = "daebb240-b041-11e4-9e45-0002a5d5c51b";

    constructor() {
        makeAutoObservable(this);

        this.isBluetoothSupported = !!navigator.bluetooth;
    }

    setError(message) {
        this.error = message;
    }

    clearError() {
        this.error = null;
    }

    resetState() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristics = [];
        this.isConnected = false;
    }

    async loadPermittedDevices() {
        if (!this.isBluetoothSupported) return;

        try {
            const devices = await navigator.bluetooth.getDevices();

            runInAction(() => {
                this.permittedDevices = devices;
            });
        } catch (e) {
            console.error("getDevices error:", e);
        }
    }

    async forgetDevice(deviceId) {
        try {
            const devices = await navigator.bluetooth.getDevices();
            const device = devices.find(d => d.id === deviceId);

            if (!device) return;

            await device.forget();
            await this.loadPermittedDevices();
        } catch (e) {
            console.error("forgetDevice error:", e);
        }
    }

    async requestDevice() {
        if (!this.isBluetoothSupported) {
            this.setError("Web Bluetooth API не поддерживается");
            return;
        }

        this.isLoading = true;
        this.clearError();

        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [this.serviceUUID]
            });

            runInAction(() => {
                this.device = device;
            });

            await this.loadPermittedDevices();
        } catch (e) {
            runInAction(() => {
                this.error = e.message;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async connect(device) {
        if (!device) {
            this.setError("Устройство не выбрано");
            return;
        }

        this.isLoading = true;
        this.clearError();

        try {
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(this.serviceUUID);
            const characteristics = await service.getCharacteristics();

            runInAction(() => {
                this.device = device;
                this.server = server;
                this.service = service;
                this.characteristics = characteristics;
                this.isConnected = true;
            });

            device.addEventListener("gattserverdisconnected", () => {
                runInAction(() => {
                    this.resetState();
                });
            });
        } catch (e) {
            runInAction(() => {
                this.error = e.message;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async readCharacteristic(characteristic) {
        if (!characteristic || !characteristic.properties.read) {
            return null;
        }

        try {
            const value = await characteristic.readValue();
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(value);
        } catch (e) {
            console.error("readCharacteristic error:", e);
            return null;
        }
    }

    disconnect() {
        if (this.device?.gatt?.connected) {
            this.device.gatt.disconnect();
        }
        this.resetState();
    }
}

export const bluetoothStore = new BluetoothStore();
