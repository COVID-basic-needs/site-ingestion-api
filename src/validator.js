/**
 * Validates JSON input
 * 
 * Expect data format to be an array of objects, each with a site, siteDetails field
 */

const Validator = require('jsonschema').Validator;
const { dataSchema } = require("./schema");
var v = new Validator();

// return true if valid body JSON
// expect an array of JSON objects, each containing
module.exports = function(data) {
    for (i = 0; i < data.length; i++){
        let entry = data[i];
        let valRes = v.validate(entry, dataSchema);
        if (!valRes.valid) {
            // return the first error message
            return [false, `Invalid data format for entry ${i}: ${valRes.errors[0].message}`];
        }
    }

    return [true, null];
}