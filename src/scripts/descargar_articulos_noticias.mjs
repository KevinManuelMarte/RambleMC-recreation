import dotenv from 'dotenv';
import fs from 'node:fs';
import fm from 'front-matter'
import path from 'path';

dotenv.config();
let {PUBLIC_RAMBLE_NEWS_LINK} = process.env

export default class NewsDownloader {
    async getAllNews (){
        const News = await
            fetch(`${PUBLIC_RAMBLE_NEWS_LINK}`)
            .then(response => response.json())
            .then(News => News)

        return News;
    }

    async getAllNewsDownloadLinks () {
        const News_Downloader =  new NewsDownloader;
        const News = await News_Downloader.getAllNews()
        .then((News) => News.map((Guide)=> {return Guide.download_url}))

        return News;
    }

    async downloadAllNewsMD () {
        const News_Downloader =  new NewsDownloader;
        const NewsNames = [];

        const News = new Promise((resolve, reject)=> {
            News_Downloader.getAllNewsDownloadLinks()
            .then((NewsLinks) => NewsLinks.forEach((GuideLink, idx, array) => {

            const NewContent = fetch(`${GuideLink}`)
            .then(response => response.text())
            .then(data => data)

            const NewFM = NewContent.then(data => fm(data))

            NewFM
            .then(async (FMData) => {
    
                const FilePath = path.join("src/"  + "content/" + "noticias/" + `${(FMData.attributes).title}.md`)
                fs.writeFile(`${FilePath}`, await NewContent, ()=> {})
                NewsNames.unshift(`${(FMData.attributes).title}.md`);
                if (idx == array.length - 1) {
                    resolve(NewsNames)
                }
            })
        })).catch(error => reject(error))
        })

        
        return News.then(() => console.log('¡Artículos de noticias descargados exitosamente!')).catch(error => console.log('¡Ha ocurrido un error al intentar descargar los articulos de las noticias! \n' + error ));
    }

}
