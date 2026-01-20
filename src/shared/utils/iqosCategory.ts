import type {IqosCategory} from "../types/iqos.ts";

export function getChildCategories( categories: IqosCategory[], parentId: string ): IqosCategory[] {
    return categories.filter(category => category.parentId === parentId);
}

export function hasChildren( categories: IqosCategory[], categoryId: string ): boolean {
    return categories.some(category => category.parentId === categoryId);
}