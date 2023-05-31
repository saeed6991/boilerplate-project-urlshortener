require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const urlParser = require('url');
const Site = require("./Site");
//Site.deleteMany({})

// Basic Configuration
const port = process.env.PORT || 3000;

const dns = require("dns");
const { hostname } = require("os");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));

/*Site.deleteMany({}).then(()=>{
  console.log("db cleared!")
})*/

app.post("/api/shorturl/", (req, res) => {
  const requested_url = req.body.url;
  console.log(requested_url);
  const dnslookup = dns.lookup(urlParser.parse(requested_url).hostname, async (err, address)=> {
    if (!address) {
      res.json({ error: "invalid url" });
    } else {
      displayDb().then((data) => {
        console.log("Complete Model:" + data);
        let site_number = data.length;
        findByUrl(requested_url)
          .then((data) => {
            console.log("data corresponding to the entered url: " + data);
            if (data.length === 0) {
              let new_site = new Site({
                url: requested_url,
                shorturl: site_number,
              });
              new_site.save().then(() => console.log(new_site));
              res.json({
                original_url: requested_url,
                short_url: site_number
              });
            } else {
              res.json({
                "original_url": data[0].url,
                "short_url": data[0].shorturl,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  })
});

app.get("/api/shorturl/:number?", (req, res) => {
  let requested_number = Number(req.params.number);
  findByShortUrl(requested_number)
    .then((data) => {
      if (data.length ===0) res.json({ error: 'invalid url' });
      console.log("this is data " + data[0]);

      res.redirect(data[0].url);
    })
    .catch((err) => {
      console.log(err);
    });
});

const findByShortUrl = (shorturl) => {
  return Site.find({ shorturl: shorturl });
};

const findByUrl = (url) => {
  return Site.find({ url: url });
};

const displayDb = () => {
  return Site.find({});
};
