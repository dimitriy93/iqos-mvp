import type {IqosCategory, IqosProduct} from "@/shared/types/iqos.ts";
import {LOCAL_FEED_URL, REMOTE_FEED_URL} from "@/shared/constants/iqos.ts";

async function fetchXML(url:string): Promise<Response> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Ошибка загрузки');
    }

    return res;
}
export async function fetchIqosFeed(): Promise<{
    categories: IqosCategory[];
    products: IqosProduct[];
}> {
    let res: Response;

    try {
        res = await fetchXML(LOCAL_FEED_URL);
    } catch {
        res = await fetchXML(REMOTE_FEED_URL);
    }

    if (!res.ok) {
        throw new Error('Ошибка загрузки');
    }

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');

    const categories: IqosCategory[] = Array.from(
        doc.querySelectorAll("categories > category")
    ).map((node) => ({
        id: node.getAttribute("id")!,
        parentId: node.getAttribute("parentId") ?? undefined,
        name: node.textContent?.trim() ?? "",
    }));

    const products: IqosProduct[] = Array.from(
        doc.querySelectorAll("offers > offer")
    ).map((offer) => ({
        id: offer.getAttribute("id")!,
        available: offer.getAttribute("available") === "true",
        name: offer.querySelector("name")?.textContent ?? "",
        price: Number(offer.querySelector("price")?.textContent ?? 0),
        currencyId: offer.querySelector("currencyId")?.textContent ?? "",
        categoryId: offer.querySelector("categoryId")?.textContent ?? "",
        url: offer.querySelector("url")?.textContent ?? "",
        picture: offer.querySelector("picture")?.textContent ?? undefined,
        description:
            offer.querySelector("description")?.textContent ?? undefined,
    }));

    return { categories, products };
}