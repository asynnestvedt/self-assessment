const path = require("path")
const fs = require("fs")

const DATA_DIR = "data"
const DATA_FILE_ASSESSMENTS = path.join(DATA_DIR, "assessments.json")
const DATA_FILE_TEAMS = path.join(DATA_DIR, "teams.json")
const DATA_FILE_AGGREGATES = path.join(DATA_DIR, "aggregates.json")
const DATA_FILE_ROLES = path.join(DATA_DIR, "roles.json")
const DATA_FILE_FACETS = path.join(DATA_DIR, "facets.json")
const KEYPATH = "server.key"
const CERTPATH = "server.cert"
const SSLOPTiONSEXIST = fs.existsSync(KEYPATH) && fs.existsSync(CERTPATH)


if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR)
}

if (!fs.existsSync(DATA_FILE_ASSESSMENTS)) {
    fs.writeFileSync(DATA_FILE_ASSESSMENTS, "[]", "utf8")
}

if (!fs.existsSync(DATA_FILE_TEAMS)) {
    fs.writeFileSync(DATA_FILE_TEAMS, "[]", "utf8")
}

if (!fs.existsSync(DATA_FILE_AGGREGATES)) {
    fs.writeFileSync(DATA_FILE_AGGREGATES, "[]", "utf8")
}

if (!fs.existsSync(DATA_FILE_ROLES)) {
    fs.writeFileSync(DATA_FILE_ROLES, "[]", "utf8")
}

if (!fs.existsSync(DATA_FILE_FACETS)) {
    fs.writeFileSync(DATA_FILE_FACETS, "[]", "utf8")
}

/**
 * Configuration object for the application.
 * @typedef {Object} AppConfig
 * @property {string} DATA_DIR - The directory path for data files.
 * @property {string} DATA_FILE_ASSESSMENTS - The path to the assessments data file.
 * @property {string} DATA_FILE_TEAMS - The path to the teams data file.
 * @property {string} DATA_FILE_AGGREGATES - The path to the aggregates data file.
 * @property {string} DATA_FILE_ROLES - The path to the roles data file.
 * @property {string} DATA_FILE_FACETS - The path to the facets data file.
 * @property {string} KEYPATH - The path to the server key file.
 * @property {string} CERTPATH - The path to the server certificate file.
 * @property {boolean} SSLOPTiONSEXIST - Indicates whether both the server key and certificate files exist.
 */

/**
 * Configuration settings for the application.
 * @type {AppConfig}
 * @constant
 */
module.exports = {
    DATA_DIR,
    DATA_FILE_ASSESSMENTS,
    DATA_FILE_TEAMS,
    DATA_FILE_AGGREGATES,
    DATA_FILE_ROLES,
    DATA_FILE_FACETS,
    KEYPATH,
    CERTPATH,
    SSLOPTiONSEXIST
}
