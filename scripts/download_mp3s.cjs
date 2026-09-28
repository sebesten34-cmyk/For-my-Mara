const fs = require("fs");
const https = require("https");
const http = require("http");

const trackQueries = [
  { file: "arctic_monkeys_i_wanna_be_yours.mp3", q: "arctic monkeys i wanna be yours" },
  { file: "cigarettes_after_sex_k.mp3", q: "cigarettes after sex k" },
  { file: "new_west_those_eyes.mp3", q: "new west those eyes" },
  { file: "bitza_cheloo_vorbeste_vinul.mp3", q: "bitza vorbeste vinul" },
  { file: "bruno_mars_risk_it_all.mp3", q: "Risk It All Bruno Mars" },
  { file: "codu_penal_daca_n_ai_fi_tu.mp3", q: "codu penal daca n-ai fi tu" },
  { file: "sorin_copilul_de_aur_suflet_pereche.mp3", q: "sorin copilul de aur suflet pereche" },
  { file: "sami_g_sper_ca_esti_bine.mp3", q: "sami g sper ca esti bine" }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(fs.statSync(dest).size);
      });
    }).on("error", reject);
  });
}

async function run() {
  for (const t of trackQueries) {
    const searchRes = await fetchJson("https://api.deezer.com/search?q=" + encodeURIComponent(t.q));
    const first = searchRes.data && searchRes.data[0];
    if (!first || !first.preview) {
      console.error("No preview found for:", t.file);
      continue;
    }
    console.log("Downloading", t.file, "from", first.title, "by", first.artist.name);
    const dest = "./public/audio/" + t.file;
    const size = await downloadFile(first.preview, dest);
    console.log("Saved", dest, size, "bytes");
    if (fs.existsSync("./dist/audio")) {
      fs.copyFileSync(dest, "./dist/audio/" + t.file);
    }
  }
  console.log("All downloads completed!");
}

run();
