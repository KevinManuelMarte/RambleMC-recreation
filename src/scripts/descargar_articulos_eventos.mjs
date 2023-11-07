import dotenv from 'dotenv';
import fs from 'node:fs';
import fm from 'front-matter'
import path from 'path';

dotenv.config();
const {PUBLIC_RAMBLE_EVENTS_LINK} = process.env
let EventsNames = [];

export default class EventsDownloader {
    async getAllEvents (){
        const Events = await
            fetch(`${PUBLIC_RAMBLE_EVENTS_LINK}`)
            .then(response => response.json())
            .then(events => events)
            // .then(events => events.map((event:any) => event.download_url))

        return Events;
    }

    async getAllEventsDownloadLinks () {
        const Events_Downloader =  new EventsDownloader;
        const Events = await Events_Downloader.getAllEvents()
        .then((events) => events.map((event)=> {return event.download_url}))

        return Events;
    }

    async downloadAllEventsMD () {


        const Events = new Promise((resolve, reject)=> {
            const Events_Downloader = new EventsDownloader;
            Events_Downloader.getAllEventsDownloadLinks()
            .then((eventsLinks) => eventsLinks.forEach((eventLink, idx, array) => {

            const EventContent = fetch(`${eventLink}`)
            .then(response => response.text())
            .then(data => data)

            const EventFM = EventContent.then(data => fm(data))

            EventFM
            .then(async (FMData) => {
    
                const FilePath = path.join("src/"  + "content/" + "eventos/" + `${(FMData.attributes).title}.md`)
                fs.writeFile(`${FilePath}`, await EventContent, ()=> {})
                EventsNames.unshift(`${(FMData.attributes).title}.md`);
                if (idx == array.length - 1) {
                    resolve(EventsNames)
                }
            })
        }))
        })

        
        return Events.then(()=> console.log('¡Artículos descargados exitosamente!')).catch(error => console.log('¡Ha ocurrido un error al descargar los articulos de los eventos! \n' + error ));
    }

}
