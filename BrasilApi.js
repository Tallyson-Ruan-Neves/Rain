import { get } from "https";

async function getCity(cep) {
  const urlApi = "https://brasilapi.com.br/api/cep/v2/" + cep;

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
    const locale = JSON.parse(data);
    return locale;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Não foi possivel encontrar sua cidade!");
  }
}

export { getCity };
