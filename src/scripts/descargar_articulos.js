
import EventsDownloader from './descargar_articulos_eventos.mjs';
import GuidesDownloader from './descargar_articulos_guias.mjs';
import NewsDownloader from './descargar_articulos_noticias.mjs';
import FAQDownloader from './descargar_articulos_FAQ.mjs';

const Events_Downloader = new EventsDownloader;
const Guides_Downloader =  new GuidesDownloader;
const News_Downloader = new NewsDownloader;
const FAQ_Downloader = new FAQDownloader;

Events_Downloader.downloadAllEventsMD();
Guides_Downloader.downloadAllGuidesMD();
News_Downloader.downloadAllNewsMD();
FAQ_Downloader.downloadAllFAQMD();
