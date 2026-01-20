export const IQOS_CATALOG_CATEGORY_ID: string = '369';
export const LOCAL_FEED_URL: string = '/iqos-mvp/data/mindbox_feed.xml';
export const REMOTE_FEED_URL = import.meta.env.DEV
    ? '/api/mindbox_feed.xml'
    : import.meta.env.VITE_API_URL;