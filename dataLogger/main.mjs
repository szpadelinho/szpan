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

async function main(){
    try{
        const name = await askUser("Jak masz na imię?\n")
        const surname = await askUser("Jak masz na nazwisko?\n")
        const age = await askUser("Ile masz lat?\n")

        //console.log(`Nazywasz się ${name} ${surname}. Masz ${age} lat.`)

        const data = {
            name,
            surname,
            age
        }

        fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
        console.log("Pomyślnie zapisano dane w data.json.")
        
        const foundData = fs.readFileSync('data.json', 'utf-8')
        const userData = JSON.parse(foundData)
        console.log(`Nazywasz się ${userData.name} ${userData.surname}. Masz ${userData.age} lat.`)
    }
    catch(err){
        console.error(err)
        console.log("Nie zapisano danych.")
    }
    finally{
        rl.close()
    }
}

main()