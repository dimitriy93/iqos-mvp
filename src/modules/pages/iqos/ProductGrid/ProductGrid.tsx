import type {ProductGridProps} from "@/shared/types/product-grid.ts";
import "./product-grid.css";

export const ProductGrid = ({ products }: ProductGridProps) => {
    if (products.length === 0) {
        return <div>Нет товаров</div>
    }

    return (
        <div className="iqos-page__products">
            {products.map((product) => (
                <div key={product.id} className="iqos-product-card">
                    {product.picture && (
                        <div className="iqos-product-card__image-wrapper">
                            <img src={product.picture} alt={product.name} className="iqos-product-card__image"/>
                        </div>
                    )}

                    <div className="iqos-product-card__content">
                        <div className="iqos-page__product__name">
                            {product.name}
                        </div>
                    </div>

                    <div className="iqos-page__product-price">
                        {product.price} руб
                    </div>
                </div>
            ))}
        </div>
    )
};
