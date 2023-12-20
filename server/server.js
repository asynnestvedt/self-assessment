const express = require("express")
const fs = require("fs")
const https = require("https")
const http = require("http")
const bodyParser = require("body-parser")
const config = require("./config")

// Initialize Express
const app = express()

// Body parser middleware to handle JSON data
app.use(bodyParser.json())

// disable client side caching
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    res.set("Pragma", "no-cache")
    res.set("Expires", "0")
    next()
})

// load route files
const normalizedPath = require("path").join(__dirname, "routes")
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./routes/" + file)
})

app.get("/api/alldata", (req, res) => {
    try {
        const payload = {
            assessments: JSON.parse(fs.readFileSync(config.DATA_FILE_ASSESSMENTS)),
            teams: JSON.parse(fs.readFileSync(config.DATA_FILE_TEAMS)),
            aggregates: JSON.parse(fs.readFileSync(config.DATA_FILE_AGGREGATES)),
            roles: JSON.parse(fs.readFileSync(config.DATA_FILE_ROLES)),
            facets: JSON.parse(fs.readFileSync(config.DATA_FILE_FACETS))
        }
        res.status(200).json(payload)
    } catch (e) {
        res.status(500).send("Error reading data file")
    }

})

// serve static files after routes
app.use(express.static("public"))

if (config.SSLOPTiONSEXIST) {
    const httpsOptions = {
        key: fs.readFileSync(config.KEYPATH),
        cert: fs.readFileSync(config.CERTPATH)
    }

    https.createServer(httpsOptions, app).listen(3000, () => {
        console.log("HTTPS server running on port 3000")
    })
} else {
    http.createServer(app).listen(3000, () => {
        console.log("HTTP server running on port 3000")
    })
}
