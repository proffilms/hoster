"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioer_1 = __importDefault(require("./ioer"));
// import path from 'path';
// import fs from 'fs';
// import Jimp from "jimp"
// const db = admin.firestore();
const http_1 = __importDefault(require("http"));
const Routes_1 = __importDefault(require("./Routes"));
console.log("JSON.stringify(db)");
console.log("Hello: Peace");
const cors = require('cors');
const app = express_1.default();
const server = http_1.default.createServer(app);
ioer_1.default(server);
// 
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
/* app.get("/the", async (request, response) => {
  // let data = {name: "location"};

  const snaps = await db.collection("gallery").get();
  console.log("Gallery Database");
  let data = "";
  snaps.forEach((v:any,i:number,a:any) => {
    data += v.data().link + "<br />";

    Jimp.read(v.data().link).then((image: any) => {
      let img = image.resize(100, Jimp.AUTO).write(v.data().title);
      Jimp.read(img, (err:any, imag:any) => {
        if(err) console.log(err);
        imag.getBase64(Jimp.AUTO, (base:any) => {
          db.collection('gallery').doc(v.id).set({thumbnail: base}, {merge: true});
        });
      });
    }).catch((err:any) => {
        console.log(err);
    });
  });


  // Jimp.read("./src/D2.jpg").then((image: any) => {
  //     return image.resize(100, Jimp.AUTO).write("newD2.jpg");
  // }).catch((err:any) => {
  //     console.log(err);
  // });
  // storage.ref("gallery");
  response.send(data);
}); */
app.use("/files", express_1.default.static("./static"));
app.use(Routes_1.default);
app.post("/upload", (req, res) => {
    // console.log(JSON.parse(req.body));3
    console.log(req.body);
    res.json({ name: "uploading", date: new Date().getTime() });
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
let port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log("Listening on Port:", port);
});
//# sourceMappingURL=index.js.map