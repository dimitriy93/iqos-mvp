import { makeAutoObservable, runInAction } from "mobx";

class UsbStore {
    device = null;
    deviceInfo = null;
    interfaces = [];
    endpoints = [];
    isConnected = false;
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isUsbSupported() {
        return !!navigator.usb;
    }

    async connectDevice() {
        if (!this.isUsbSupported) {
            this.error = "WebUSB API не поддерживается браузером";
            return;
        }

        runInAction(() => {
            this.isLoading = true;
            this.error = null;
            this.deviceInfo = null;
            this.interfaces = [];
            this.endpoints = [];
        });

        try {
            const device = await navigator.usb.requestDevice({
                filters: []
            });

            await device.open();

            if (device.configuration === null) {
                await device.selectConfiguration(1);
            }

            const interfaces = [];
            const endpoints = [];

            device.configuration.interfaces.forEach(i => {
                interfaces.push({
                    interfaceNumber: i.interfaceNumber,
                    alternates: i.alternates.length
                });

                i.alternates.forEach(alt => {
                    alt.endpoints.forEach(ep => {
                        endpoints.push({
                            interfaceNumber: i.interfaceNumber,
                            endpointNumber: ep.endpointNumber,
                            direction: ep.direction,
                            type: ep.type
                        });
                    });
                });
            });

            runInAction(() => {
                this.device = device;
                this.deviceInfo = {
                    vendorId: device.vendorId,
                    productId: device.productId,
                    productName: device.productName,
                    manufacturerName: device.manufacturerName,
                };
                this.interfaces = interfaces;
                this.endpoints = endpoints;
                this.isConnected = true;
            });

        } catch (e) {
            runInAction(() => {
                this.error = e.message;
                this.isConnected = false;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    disconnectDevice() {
        try {
            if (this.device?.opened) {
                this.device.close();
            }
        } catch (e) {
            console.error("Ошибка закрытия устройства", e);
        }

        runInAction(() => {
            this.device = null;
            this.deviceInfo = null;
            this.interfaces = [];
            this.endpoints = [];
            this.isConnected = false;
        });
    }

    clearError() {
        this.error = null;
    }
}

export const usbStore = new UsbStore();