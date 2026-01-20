import type {IqosCategory} from "./iqos.ts";

export interface CategoryListProps {
    categories: IqosCategory[];
    selectedCategoryId: string | null;
    onSelect: (id: string) => void;
    onBack?: () => void;
}