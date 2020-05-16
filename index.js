'use strict';
const pushToAirtable = require('./src/pushToAirtable'); 

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

    let data;
    try {
        data = JSON.parse(event.body);
    } catch(e) {
        console.log("Bad input: " + event.body);

        return {
            statusCode: 415,
            body: JSON.stringify({
                error: "Bad payload",
            }),
        };
    }

    console.log("Body: " + data);
    
    let responseBody = {
        message: "Hello World!",
    };
    
    let response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };

    console.log("Response: " + JSON.stringify(response))
    return response;
};