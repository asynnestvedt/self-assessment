const config = require("../config")
const fs = require("fs")
const express = require("express")
const router = express.Router()

// Endpoint to write survey results
router.post("/teams", (req, res) => {
    const newAssessment = req.body
    fs.readFile(config.DATA_FILE_TEAMS, (err, data) => {
        if (err) {
            res.status(500).send("Error reading data file")
        } else {
            const assessments = JSON.parse(data)
            assessments.push(newAssessment)
            fs.writeFile(config.DATA_FILE_TEAMS, JSON.stringify(assessments), (err) => {
                if (err) {
                    res.status(500).send("Error writing data file")
                } else {
                    res.status(200).send("Assessment saved")
                }
            })
        }
    })
})

// Endpoint to read survey results
router.get("/teams", (req, res) => {
    fs.readFile(config.DATA_FILE_TEAMS, (err, data) => {
        if (err) {
            res.status(500).send("Error reading data file")
        } else {
            res.status(200).json(JSON.parse(data))
        }
    })
})


module.exports = router