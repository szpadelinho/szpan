import readline from 'readline'

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

function asyncOperation(a, b, operation, callback){
    setTimeout(() => {
        if(typeof a !== 'number' || typeof b !== 'number' || (operation !== "dodawanie" && operation !== "odejmowanie")){
            callback(new Error("Podałeś nieprawidłowe dane. Spróbuj jeszcze raz."), null)
            return
        }

        if(operation == "dodawanie"){
            callback(null, a + b)
        }

        if(operation == "odejmowanie"){
            callback(null, a - b)
        }

    }, 1000)
}

function promiseOperation(a, b, operation){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(typeof a !== 'number' || typeof b !== 'number' || (operation != "dodawanie" && operation != "odejmowanie")){
                reject(new Error("Podałeś nieprawidłowe dane. Spróbuj jeszcze raz."))
                return
            }
    
            if(operation == "dodawanie"){
                resolve(a + b)
            }
    
            if(operation == "odejmowanie"){
                resolve(a - b)
            }
    
        }, 1000)
    })
}

async function main(){
    const a = parseInt(await askUser("Podaj pierwszą liczbę:\n"))
    const b = parseInt(await askUser("Podaj drugą liczbę:\n"))
    const operation = await askUser("Które działanie chcesz wykonać: dodawanie, czy odejmowanie?\n")
    const method = await askUser("Którą metodę wybierasz: callback, czy może promise?\n")

    if(method == "callback"){
        asyncOperation(a, b, operation, (error, result) => {
            if(error){
                console.error(error)
            }
            else{
                console.log(`Wynik (callback): ${result}`)
            }
        })
        rl.close()
    }
    else if(method == "promise"){
        promiseOperation(a, b, operation)
        .then(result => console.log(`Wynik (promise): ${result}`))
        .catch(err => console.error(err))
        .finally(() => rl.close())
    }
    else{
        console.log("Wybierz prawidłową metodę obliczania.")
        rl.close()
        return
    }
}

main()