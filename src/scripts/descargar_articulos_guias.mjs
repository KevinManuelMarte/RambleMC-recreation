import dotenv from 'dotenv';
import fs from 'node:fs';
import fm from 'front-matter'
import path from 'path';

dotenv.config();
let {PUBLIC_RAMBLE_GUIDES_API_LINK} = process.env

export default class GuidesDownloader {
    async getAllGuides (){

        const Guides = await
            fetch(`${PUBLIC_RAMBLE_GUIDES_API_LINK}`)
            .then(response => response.json())
            .then(Guides => Guides)

        return Guides;
    }

    async getAllGuidesDownloadLinks () {
        const Guides_Downloader =  new GuidesDownloader;
        const Guides = await Guides_Downloader.getAllGuides()
        .then((Guides) => Guides.map((Guide)=> {return Guide.download_url}))

        return Guides;
    }

    async downloadAllGuidesMD () {
        const Guides_Downloader =  new GuidesDownloader;
        const GuidesNames = [];

        const Guides = new Promise((resolve, reject)=> {
            Guides_Downloader.getAllGuidesDownloadLinks()
            .then((GuidesLinks) => GuidesLinks.forEach((GuideLink, idx, array) => {

            const GuideContent = fetch(`${GuideLink}`)
            .then(response => response.text())
            .then(data => data)

            const GuideFM = GuideContent.then(data => fm(data))

            GuideFM
            .then(async (FMData) => {
    
                const FilePath = path.join("src/"  + "content/" + "guias/" + `${(FMData.attributes).title}.md`)
                fs.writeFile(`${FilePath}`, await GuideContent, ()=> {})
                GuidesNames.unshift(`${(FMData.attributes).title}.md`);
                if (idx == array.length - 1) {
                    resolve(GuidesNames)
                }
            })
        })).catch(error => reject(error))
        })

        
        return Guides.then(() => console.log('¡Artículos de guias descargados exitosamente!')).catch(error => console.log('¡Ha ocurrido un error al intentar descargar los articulos de las guias!\n' + error ));
    }

}
