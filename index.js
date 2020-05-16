'use strict';
console.log('Loading site ingestion API');

import pushToAirtable from './src/pushToAirtable'; 

exports.handler = async (event) => {
    console.log("Request: " + JSON.stringify(event));
    
    if (Object.keys(event.body).length === 0) {
        return {
            statusCode: 400,
            body: {
                error: "Empty payload",
            },
        };
    }

    try {
        let data = JSON.parse(event.body);
    } catch(e) {
        console.log("Bad input: " + event.body);

        return {
            statusCode: 415,
            body: {
                error: "Bad payload",
            },
        };
    }

    console.log("Body: " + data);
    
    let responseBody = {
        message: "Hello World!",
    };
    
    // The output from a Lambda proxy integration must be 
    // in the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    let response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};