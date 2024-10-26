import readline from 'readline'
import fs from 'fs'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askUser(question){
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer)
        })
    })
}

function createObject(name, age, email){
    const data = {
        name,
        age,
        email
    }

    let existingData = []

    const filePath = './object.json'

    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath, 'utf-8')
        existingData = JSON.parse(fileData)
    }

    existingData.push(data)

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))
    console.log("Obiekt został dodany.")
}

function readObject(){
    const filePath = './object.json'

    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(fileData)
        console.log("Zawartośc pliku JSON: ", data)
    }
    else{
        console.log("Dany plik niestety nie istnieje. Utwórz go.")
    }
}

async function main(){
    const choice = await askUser("Chcesz utworzyć obiekt, czy go odczytać?\n")

    if(choice === "odczytać"){
        readObject()
    }
    else if(choice === "utworzyć"){
        const name = await askUser("Podaj swoje imię:\n")
        const age = await askUser("Podaj swój wiek:\n")
        const email = await askUser("Podaj swój email:\n")

        createObject(name, age, email)
    }
    else{
        console.log("Wskaż prawidłową opcję.")
    }

    rl.close()
}

main()