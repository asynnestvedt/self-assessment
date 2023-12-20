const config = require("../config")
const fs = require("fs")
const express = require("express")
const router = express.Router()

// Endpoint to read survey results
router.get("/facets", (req, res) => {
    fs.readFile(config.DATA_FILE_FACETS, (err, data) => {
        if (err) {
            res.status(500).send("Error reading data file")
        } else {
            res.status(200).json(JSON.parse(data))
        }
    })
})

module.exports = router