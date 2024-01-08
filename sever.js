import express from 'express'
import { createServer } from 'http'
import { config } from 'dotenv'
import { getClima } from './openweather.js'
import { getCity } from './BrasilApi.js'

import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config()

const PORT = process.env.PORT || 3000
const ApiKey = process.env.ApiKey

const app = express()
const sever = createServer(app)

app.use("/static", express.static("public"))

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/public/index.html')
})

app.get('/CEP', async (req, res) => {
    try{
        const cepInString = req.query.CEP
        const cep = parseInt(cepInString)
        const locale = await getCity(cep)
        const nameCity = locale.city
        const tokenApi = ApiKey

        const clima = await getClima(nameCity, tokenApi)
        console.log(clima)

        res.redirect(
          `/clima?temp=${clima.main.temp}&wind=${clima.wind.speed}&icon=${clima.weather[0].icon}&humidity=${clima.main.humidity}&city=${nameCity}&description=${clima.weather[0].description}`
        );
    } catch (error){
        console.error("Error: ", error.message)
        res.status(500)
    }

app.get('/clima', (req, res) => {
    const temperature = req.query.temp;
    const speedOfWind = req.query.wind
    const icon = req.query.icon
    const humidity = req.query.humidity;
    const city = req.query.city
    const description = req.query.description


    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Clima</title>
            <link rel="stylesheet" href="static/css/style.css">
        </head>
        <body>
            <div class="container">
                <div class="container circle">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" >
                </div>
                <p>Cidade: ${city} </p>
                <p>Descrição: ${description} </p>
                <p>Tempertura: ${temperature} Cº </p>
                <p>Umidade do ar: ${humidity}% </p>
                <p>Velocidade do vento: ${speedOfWind} m/s </p>
            </div>
        </body>
        </html>
    `);
})

})

sever.listen(PORT, () => {
    console.log('> Running sever in port ' + PORT + "...")
})