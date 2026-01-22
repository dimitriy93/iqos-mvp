import {makeAutoObservable, runInAction} from "mobx";

class BluetoothStore {
    device = null;
    characteristics = [];
    deviceInfo = null;
    isLoading = false;
    error = null;
    readingValues = {};
    isConnected = false;

    serviceUuids = [
        '58361e6d-e579-1df8-8997-50aa66a3add0',
        '664578b6-c390-42d8-956e-c1ae8b646436',
        'daebb240-b041-11e4-9e45-0002a5d5c51b'
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
            console.error('Ошибка декодирования:', err);
            return `Ошибка декодирования: ${err.message}`;
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
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices : this.serviceUuids
            });

            runInAction(() => {
                this.device = device;
                this.deviceInfo = {
                    id: device.id,
                    name: device.name,
                    connected: false
                };
            });

            const server = await device.gatt.connect();

            for (const serviceUuid of this.serviceUuids) {
                try {
                    const service = await server.getPrimaryService(serviceUuid);
                    console.log("service === ", service)

                    const chars = await service.getCharacteristics();
                    console.log("chars === ", chars)

                    runInAction(() => {
                        this.characteristics = [...this.characteristics, ...chars];
                        this.isConnected = true;
                        this.deviceInfo.connected = true;
                    });

                } catch (serviceError) {
                    console.log(`Сервис ${serviceUuid} не найден:`, serviceError);
                }
            }
        } catch (error) {
            console.error('Ошибка подключения:', error);
            runInAction(() => {
                this.error = `Ошибка подключения: ${error.message}`;
                this.isConnected = false;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    disconnectDevice() {
        if (this.device && this.device.gatt.connected) {
            this.device.gatt.disconnect();
        }

        runInAction(() => {
            this.device = null;
            this.characteristics = [];
            this.deviceInfo = null;
            this.isConnected = false;
            this.readingValues = {};
        });
    }

    async ensureConnected() {
        if(!this.device.gatt.connected) {
            runInAction(() => {
                this.isConnected = false;
            })
            try {
                console.log("Переподключение ...")
                console.log("device === ", this.device);
                await this.device.gatt.connect();
                runInAction(() => {
                    this.isConnected = true;
                })
            } catch (error) {
                console.error(`Ошибка переподключения: ${error.message}`)
            }
        }
        console.log("Переподключение не требуется")
        console.log("device === ", this.device);
    }

    async readCharacteristic(characteristic, index) {
        if (!characteristic.properties.read) {
            runInAction(() => {
                this.readingValues[index] = 'Характеристика не поддерживает чтение';
            });
            return;
        }

        runInAction(() => {
            this.readingValues[index] = 'Чтение...';
        });

        try {
            await this.ensureConnected()
            const value = await characteristic.readValue();
            const decodedValue = this.decodeBuffer(value);

            runInAction(() => {
                this.readingValues[index] = decodedValue;
            });

        } catch (readError) {
            console.error(`Ошибка чтения характеристики ${index}:`, readError);
            runInAction(() => {
                this.readingValues[index] = `Ошибка чтения: ${readError.message}`;
            });
        }
    }

    async readAllCharacteristics() {
        runInAction(() => {
            this.characteristics.forEach((char, index) => {
                if (char.properties.read) {
                    this.readingValues[index] = 'Чтение...';
                } else {
                    this.readingValues[index] = 'Не поддерживает чтение';
                }
            });
        });

        for (let i = 0; i < this.characteristics.length; i++) {
            const char = this.characteristics[i];
            if (char.properties.read) {
                await this.ensureConnected()
                await this.readCharacteristic(char, i);
            }
        }
    }

    clearError() {
        this.error = null;
    }
}

export const bluetoothStore = new BluetoothStore();