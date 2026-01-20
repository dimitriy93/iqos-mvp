import {makeAutoObservable, runInAction} from 'mobx';
import { fetchIqosFeed } from '@/shared/api/iqos.api.ts';
import type {IqosCategory, IqosProduct} from "@/shared/types/iqos.ts";

class IqosStore {
    categories: IqosCategory[] = [];
    products: IqosProduct[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadProducts() {
        this.loading = true;
        this.error = null;

        try {
            const { categories, products } = await fetchIqosFeed();

            runInAction(() => {
                this.categories = categories;
                this.products = products;
                this.loading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.error = "Ошибка загрузки";
                this.loading = false;
            });
        }
    }
}

export const iqosStore = new IqosStore();