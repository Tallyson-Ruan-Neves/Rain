import { get } from "https";

async function getClima(city, tokenApi) {
  const urlApi =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    tokenApi +
    "&lang=pt_br&units=metric";

  async function getDataOfApi() {
    return new Promise((resolve, reject) => {
      get(urlApi, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });

        res.on("error", (error) => {
          reject(error);
        });
      });
    });
  }

  try {
    const data = await getDataOfApi();
    const clima = JSON.parse(data);
    return clima;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Não foi possivel encontrar o clima!");
  }
}

export { getClima };
