import http from 'http'
import fs from 'fs'
import path from 'path'

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const fileName = url.searchParams.get('file')

    if(!fileName){
        res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'})
        res.end("400: Parametr File nie istnieje.")
        return
    }

    const filePath = path.join('./', fileName)

    fs.stat(filePath, (err, stats) => {
        if(err){
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end("404: Plik nie istnieje")
            return
        }

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Length': stats.size
        })
    })

    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)

    readStream.on('error', () => {
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'})
        res.end("500: Odczytanie pliku jest niemożliwe.")
    })
})

server.listen(3000, () => {
    console.log("Serwer działa.")
})