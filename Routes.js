"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/******************************************
*  Author : erser
*  Created On : Wed Sep 18 2019
*  File : Routes.ts
*******************************************/
const express_1 = __importDefault(require("express"));
const jimp_1 = __importDefault(require("jimp"));
const hostname = "https://proffilms-hosting.firebaseapp.com";
const routes = express_1.default.Router();
routes.get("/i", (req, res) => {
    res.status(404).send("What Now");
});
// MANIP ----------------------------------
routes.get("/image/:id?", (req, res) => {
    console.log(req.query);
    let myHostname = "";
    if (req.query.l)
        myHostname = req.query.l;
    else
        myHostname = hostname + "/files/D2.jpg";
    jimp_1.default.read(myHostname).then((image) => {
        let width = jimp_1.default.AUTO, height = jimp_1.default.AUTO, limit = 120;
        const initWidth = image.bitmap.width, initHeight = image.bitmap.height;
        // CHECK ALL QUERIES - l,w,h,
        if (req.query.limit && req.query.limit !== "") {
            // IF LIMIT IS SET
            limit = req.query.limit;
            if (image.bitmap.width >= image.bitmap.height) {
                width = limit;
                height = jimp_1.default.AUTO;
            }
            else {
                width = jimp_1.default.AUTO;
                height = limit;
            }
        }
        else if ((req.query.w || +req.query.w === 0) && (req.query.h || +req.query.h === 0)) {
            // IF WIDTH & HEIGHT ARE BOTH SET
            width = req.query.w.toLowerCase() === "auto" ? jimp_1.default.AUTO : req.query.w !== "" ? +req.query.w : limit;
            height = req.query.h.toLowerCase() === "auto" ? jimp_1.default.AUTO : req.query.h !== "" ? +req.query.h : limit;
            width = +width === 0 ? 1 : width;
            height = +height === 0 ? 1 : height;
            if (req.query.w.toLowerCase() === "auto" && req.query.h.toLowerCase() === "auto")
                width = image.bitmap.width;
            // FIRST CHECK FOR THE LONGEST SIDE AND RESIZE USING THAT SIDE
            if (image.bitmap.width >= image.bitmap.height) {
                // HORIZONTAL OR SQUARE IMAGE
                if (width >= height)
                    image.resize(jimp_1.default.AUTO, width);
                else
                    image.resize(jimp_1.default.AUTO, height);
            }
            else {
                // VERTICAL IMAGE
                if (width < height)
                    image.resize(height, jimp_1.default.AUTO);
                else
                    image.resize(width, jimp_1.default.AUTO);
            }
            req.query.w.toLowerCase() === "auto" || req.query.h.toLowerCase() === "auto" ? null : image.crop(jimp_1.default.HORIZONTAL_ALIGN_CENTER, 0, +width, +height);
            console.log("Initial:", initWidth + " * " + initHeight, "Tempered:", image.bitmap.width + " * " + image.bitmap.height);
        }
        else if (!req.query.w && !req.query.h) {
            // IF W & H ARE NOT SET
            if (image.bitmap.width >= image.bitmap.height) {
                width = limit;
                height = jimp_1.default.AUTO;
            }
            else {
                width = jimp_1.default.AUTO;
                height = limit;
            }
        }
        else if (req.query.w) {
            // IF WIDTH IS ONLY SET
            width = req.query.w.toLowerCase() === "auto" ? jimp_1.default.AUTO : req.query.w;
            height = req.query.w.toLowerCase() === "auto" ? image.bitmap.height : jimp_1.default.AUTO;
        }
        else if (req.query.h) {
            // IF HEIGHT IS ONLY SET
            width = req.query.h.toLowerCase() === "auto" ? image.bitmap.width : jimp_1.default.AUTO;
            height = req.query.h.toLowerCase() === "auto" ? jimp_1.default.AUTO : req.query.h;
        }
        // FIRST CHECK IF THE FILENAME EXISTS ---------------------------------
        // let ext = image.getExtension();
        // let filename = req.query.name;
        // let thePath = path.join(__dirname, filename + "." + ext);
        // CHECK ALL QUERIES - b,g,q
        if (req.query.b)
            image.blur(req.query.b !== "" ? +req.query.b : 5);
        // if(req.query.g) image.greyscale();
        if (req.query.g)
            image.color([
                { apply: 'desaturate', params: [+req.query.g] }
            ]);
        if (req.query.q)
            image.quality(req.query.q !== "" ? +req.query.q : 75);
        // image.contain(+width, +height, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP);
        image.resize(+width, +height);
        image.getBase64(jimp_1.default.AUTO, (err, base) => {
            // console.log("The Base64 is: ",base);
            if (err)
                res.status(400).json({ error: "Base64 image Processing failed. Sorry, There's seems to be an error" });
            // res.send(base);
            const sendJSON = {
                image: base,
                initWidth: initWidth,
                initHeight: initHeight,
                width: image.bitmap.width,
                height: image.bitmap.height,
                ext: image.getExtension(),
            };
            if (req.params.id) {
                /*  let r = fs.createReadStream(sendJSON.image);
                 let ps = new stream.PassThrough();
                 stream.pipeline(r,ps,(err:any) => {
                   if(err) console.log(err);
                   return res.sendStatus(400);
                 });
                 ps.pipe(res); */
                // .replace(/^data:[a-zA-Z]+\/[a-zA-Z]+;base64,/, '')
                const img = Buffer.from(sendJSON.image.replace(/^data:[a-zA-Z]+\/[a-zA-Z]+;base64,/, ''), 'base64');
                res.writeHead(202, {
                    'Content-Type': 'image/' + sendJSON.ext,
                    'Content-Length': img.length
                });
                res.end(img);
                // res.send(sendJSON.image);
            }
            else
                res.json(sendJSON);
            // console.log(JSON.parse(image));
            /* if(fs.existsSync(thePath)) {
              // IF IT ENDS WITH A NUMBER
              let pattern = /[\d]+$/;
              let num = 1, count = 0;
              // KEEP CHECKING IF IT ENDS WITH A NUMBER --------------------------------------
              while(fs.existsSync(thePath) && count < 30) {
                let objNum = thePath.replace("." + ext , "").match(pattern);
                num = objNum ? (+objNum[0] + 1) : 1;
                console.log("num: ", num);
                thePath = path.join(__dirname, filename + "~" +num + "." + ext);
                count ++;
              }
            }else {
              console.log("Name doesn't exist");
            } */
            // res.json(image);
            /* res.send(`
            <div style="position: relative; display:flex; flex-flow:column wrap; align-items: center;">
              <p style="flex: 0 0 30px;">This is the image converted to base64</p>
              <p style="flex: 0 0 30px;">${ filename } - ${ image.bitmap.width } * ${ image.bitmap.height } ${ image.getExtension() }</p>
              <div style="position: relative; overflow: hidden; padding: 40px; flex: 1 0;">
                <img style="height: 100%" src="${base}"/>
              </div>
            </div>
            `); */
        });
    }).catch((err) => {
        res.status(res.statusCode).json({ error: "There seems to be an error with the image! " + err });
    });
});
// 404 HANDLER -------------------------------
routes.get("/:identifier?/*", (req, res) => {
    console.log(req.params);
    res.status(404).send(`
  <html>
    <head>
      <meta charset="utf-8" >
      <meta name="viewport" content="width=device-width, user-scalable=yes, minimum-scale=1.0" >
      <meta name="keywords" content="error; page-error;" >
      <meta name="description" content="Error: Try a given link or an existing link you know or contact the support team." >
      <title>Error | Page not Found!</title>
      <style>
        .main {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: row wrap;
        }
        .main > * {
          flex: 1 0 100%;
        }
        .main-container {
          background-color: #9cd1ff4a;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 45px;
          border: 1px solid #06205814;
        }
        .main-container h2 {
          font-size: 20px;
          color: #ea1515;
          padding: 24px 16px;
          text-align: center;
          border-radius: inherit;
        }
        article {
          border-bottom: 1px solid #06205834;
        }
        article p {
          font-size: 14px;
          text-align: center;
          padding: 14px 24px;
          color: #333b48;
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="main-container">
          <h2>Page Does not exist!</h2>
        </div>
        <article>
          <p>Try a given link or an existing link you know <br /> or contact the support team.</p>
          <p><a href="${"mailto:erserlive@gmail.com"}">${"support@erser.com"}</a></p>
        </article>
      </div>
    </body>
  </html>
  `);
});
exports.default = routes;
//# sourceMappingURL=Routes.js.map