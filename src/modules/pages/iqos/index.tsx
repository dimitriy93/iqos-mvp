import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {iqosStore} from "@/app/store/iqos/iqos.store.ts";
import {ProductGrid} from "./ProductGrid/ProductGrid.tsx";
import {CategoryList} from "./CategoryList/CategoryList.tsx";
import {getChildCategories, hasChildren} from "@/shared/utils/iqosCategory.ts";
import {IQOS_CATALOG_CATEGORY_ID} from "@/shared/constants/iqos.ts";
import "./iqos-page.css";

export const IqosPage = observer(() => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(IQOS_CATALOG_CATEGORY_ID);

    useEffect(() => {
        iqosStore.loadProducts();
    }, []);

    const { categories, products, loading, error } = iqosStore;

    const visibleCategories = getChildCategories(categories, selectedCategoryId);
    const hasSubcategories = hasChildren(categories, selectedCategoryId);

    const productsForCategory = hasSubcategories
        ? []
        : products.filter(product => product.categoryId === selectedCategoryId);

    const handleBack = () => {
        if (selectedCategoryId === IQOS_CATALOG_CATEGORY_ID) return;

        const current = categories.find(category => category.id === selectedCategoryId);
        setSelectedCategoryId(current?.parentId || IQOS_CATALOG_CATEGORY_ID);
    }

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка загрузки</p>;

    return (
        <section className="iqos-page">
            <h2 className="iqos-page__title">Категории</h2>

            <CategoryList
                categories={visibleCategories}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
                onBack={selectedCategoryId !== IQOS_CATALOG_CATEGORY_ID ? handleBack : undefined}
            />

            {!hasSubcategories && (
                <ProductGrid products={productsForCategory} />
            )}
        </section>
    )
})