export interface IqosCategory {
    id: string;
    name: string;
    parentId?: string;
}

export interface IqosProduct {
    id: string;
    name: string;
    price: number;
    currencyId: string;
    categoryId: string;
    url: string;
    picture?: string;
    description?: string;
    available: boolean;
}