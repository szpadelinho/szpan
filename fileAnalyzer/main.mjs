import fs from 'fs'
import path from 'path'
import {EventEmitter} from 'events'

class FileAnalyzer extends EventEmitter{
    analyzeDirectory(directory){
        fs.stat(directory, (err, stats) => {
            if(err){
                console.error(err)
                return
            }

            if(!stats.isDirectory()){
                console.error(`${directory} nie jest katalogiem.`)
            }

            fs.readdir(directory, (err, files) => {
                if(err){
                    console.error(err)
                }

                files.forEach(file => {
                    const filePath = path.join(directory, file)
                    this.emit('analyzeStart', filePath)

                    fs.stat(filePath, (err, stats) => {
                        if(err){
                            console.error(err)
                            this.emit('analyzeEnd', filePath)
                            return
                        }

                        if(stats.isFile()){
                            console.log(`Plik: ${file}\nRozmiar: ${stats.size}\nRozszerzenie: ${path.extname(file)}\nOstatnia modyfikacja: ${stats.mtime}`)
                        }
                        else if(stats.isDirectory()){
                            console.log(`Folder: ${file}`)
                        }

                        this.emit('analyzeEnd', filePath)
                    })
                })
            })
        })
    }
}

const analyzer = new FileAnalyzer()

analyzer.on('analyzeStart', (filePath) => {
    console.log(`Rozpoczynam analizę ${filePath}...`)
})

analyzer.on('analyzeEnd', (filePath) => {
    console.log(`Analiza ${filePath} zakończona.`)
})
const directory = './'

analyzer.analyzeDirectory(directory)