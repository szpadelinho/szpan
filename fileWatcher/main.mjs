import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'

class Monitor extends EventEmitter{
    constructor(directory){
        super()
        this.directory = directory
        this.fileWatchers = new Map()

        fs.watch(this.directory, (eventType, filename) => {
            if(filename){
                this.emit("directoryChanged", {eventType, filename})
                this.checkFile(filename)
            }
        })
        this.loadExistingFiles()
    }

    loadExistingFiles(){
        fs.readdir(this.directory, (err, files) => {
            if(err){
                console.error(err)
            }

            files.forEach(file => {
                this.watchFile(file)
            })
        })
    }

    watchFile(filename){
        const filePath = path.join(this.directory, filename)

        if(!this.fileWatchers.has(filePath)){
            const watcher = fs.watch(filePath, (eventType) => {
                this.emit("fileChanged", {eventType, filename})
            })

            this.fileWatchers.set(filePath, watcher)
        }
    }
    
    checkFile(filename){
        const filePath = path.join(this.directory, filename)
        
        if(fs.existsSync(filePath)){
            this.watchFile(filename)
        }
        else{
            this.removeFileWatcher(filePath)
        }
    }
    
    removeFileWatcher(filePath){
        const watcher = this.fileWatchers.get(filePath)

        if(watcher){
            watcher.close()
            this.fileWatchers.delete(filePath)
        }
    }

    startWatching(){
        console.log("Nasłuchuję zmian w katalogu: ", this.directory)
    }
}

const directory = './'
const watcher = new Monitor(directory)

watcher.on("directoryChanged", (info) => {
    console.log(`Zdarzenie w katalogu: ${info.eventType}, plik: ${info.filename}`)
})

watcher.on("fileChanged", (info) => {
    console.log(`Zdarzenie w pliku: ${info.eventType}, plik: ${info.filename}`)
})

watcher.startWatching()