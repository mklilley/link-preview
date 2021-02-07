// Created by : Matt Lilley
// Created on : 07/02/2021
// Purpose    : To make it easier to deploy a link preview server
// References : https://github.com/AndrejGajdos/link-preview-generator
//              https://github.com/mklilley/snippets/blob/master/node_api_server.js
//              https://nodejs.dev/learn/build-an-http-server

const linkPreviewGenerator = require("link-preview-generator");
const http = require("http");
const port = process.env.PORT || 7000;

const requestHandler = (req, res) => {
  let data = [];

  req.on("data", (chunk) => {
    data.push(chunk);
  });

  req.on("end", async () => {
    let url;
    try {
      const jsonBody = JSON.parse(data);
      url = jsonBody.url;
    } catch (error) {
      console.log("ERROR: Request body not JSON");
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Request body not JSON" }));
    }
    if (url === undefined) {
      console.log("ERROR: There is no url key in the json body");
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Request body does not contain url key, i.e. {'url': ...}",
        })
      );
    } else {
      // This regex pattern will recognise most standard links. Improvements are welcome 🙏.
      const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

      const urls = url.match(urlRegex);

      if (urls !== null) {
        // SUCCESS There is at least one value URL in the json body
        let previewData;
        try {
          previewData = await linkPreviewGenerator(urls[0]);
        } catch (error) {
          console.log(
            "ERROR: linkPreviewGenerator couldn't generate a preview. Generating fallback preview."
          );
          const nodeUrl = new URL(urls[0]);
          previewData = {
            title: nodeUrl.hostname,
            description: urls[0],
            domain: nodeUrl.hostname,
            img:
              "http://www.globaltrack.in/assets/testimonial_images/no-image-800x800.jpg",
          };
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(previewData));
      } else {
        console.log("ERROR: There is no URL in the json body");
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Request body does not contain a valid URL",
          })
        );
      }
    }
  });
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
