import type {CategoryListProps} from "@/shared/types/category-list.ts";

export const CategoryList = ({ categories, selectedCategoryId, onSelect, onBack }: CategoryListProps) => (
    <div className="iqos-page__categories">
        {onBack && (
            <button className="iqos-page__category iqos-page__category--back" onClick={onBack}>
                ← Назад
            </button>
        )}

        {categories.map((cat) => (
            <button
                key={cat.id}
                className={`iqos-page__category ${
                    selectedCategoryId === cat.id ? 'iqos-page__category--active' : ''
                }`}
                onClick={() => onSelect(cat.id)}
            >
                {cat.name}
            </button>
        ))}
    </div>
);