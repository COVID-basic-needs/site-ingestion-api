'use strict';
const pushToAirtable = require('./src/pushToAirtable'); 
const validate = require('./src/validator');

console.log('Loading site ingestion API');

exports.handler = async (event) => {
    console.log("Request: " + JSON.stringify(event));
    
    if (!event.body || Object.keys(event.body).length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Empty payload",
            }),
        };
    }

    let sites;
    try {
        let body = JSON.parse(event.body);
        if (!body.data || !Array.isArray(body.data) || body.data.length == 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "No data array provided",
                }),
            };
        }

        sites = body.data;
    } catch (e) {
        console.log("Invalid payload: " + event.body);
        
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Invalid payload",
            }),
        };
    }

    // check if sites conform to schema
    let [isValid, errorMsg] = validate(sites);
    if (!isValid) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: errorMsg, 
            }),
        };
    }

    // attempt to push to Airtable
    let sitesAdded, siteDetailsAdded;
    try {
        [sitesAdded, siteDetailsAdded] = await pushToAirtable(sites);
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: `${err.name}: ${err.message}`, 
            }),
        };
    }
    
    let response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Added ${sitesAdded} new sites and ${siteDetailsAdded} new site details`
        })
    };

    return response;
};