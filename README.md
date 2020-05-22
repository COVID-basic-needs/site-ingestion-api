# Site Ingestion API

This is a very basic site ingestion API hosted on AWS Lambda. It implements the handler function for the lambda webhook. This endpoint takes in a list of site JSON objects and batch pushes them to the Airtable. 

This endpoint deduplicates based on site ID, which is defined as: 

    const joined = `${site.siteName} - ${site.siteStreetAddress}, ${site.siteCity} ${site.siteState} ${site.siteZip + ""}`;
    
## Install

    git clone https://github.com/COVID-basic-needs/site-ingestion-api.git
    npm ci

## Run the tests

    npm test

CAUTION: Mocha tests will query the Airtable API for the tables defined in `.env`. 

# REST Endpoint

The endpoint can be accessed at: https://i3tmnkgp2i.execute-api.us-west-2.amazonaws.com/upload-site

## Add new sites

### Request

`POST /upload-site/`

    ## Request
    curl -X "POST" "https://i3tmnkgp2i.execute-api.us-west-2.amazonaws.com/upload-site" \
     -H 'Accept: application/json' \
     -H 'Content-Type: text/plain; charset=utf-8' \
     -d $'
        { 
            "data": [
                {
                    "siteName": "exampleSite",
                    "siteStreetAddress": "123 Example St",
                    "siteCity": "ExamplePolis",
                    "siteCountry": "USA",
                    "siteState": "ES",
                    "siteZip": 98765,
                    "contactName": "Mr. Example"
                }
            ]
        }'

### Sample Response

    HTTP/1.1 200 OK
    Date: Fri, 22 May 2020 18:17:17 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 54
    Connection: close
    Apigw-Requestid: ____________

    {"message":"Added 1 new sites and 1 new site details"}

For sites with the same site ID, only a site detail entry will be made. If you run the above cURL command, you will most likely see 0 new sites added.