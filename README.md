# Site Ingestion API

A very basic site ingestion API hosted on AWS Lambda. It implements the handler function for the lambda webhook. This endpoint takes in a list of site JSON objects and batch pushes them to the Airtable.

This endpoint de-duplicates based on Site ID. When a match is found to an existing Site this formula pushes the relevant details to the Site Details table instead.

Site ID is defined as:

    const joined = `${site.siteName} - ${site.siteStreetAddress}, ${site.siteCity} ${site.siteState} ${site.siteZip + ""}`;

## Install

    git clone https://github.com/COVID-basic-needs/site-ingestion-api.git
    npm ci

### Configure environment variables

    mv example.env .env

Fill out `.env` with your email and Airtable API key.

### Run the tests

    npm test

CAUTION: Mocha tests will query the Airtable API for the tables defined in `.env`.

## REST Endpoint

The endpoint can be accessed at: <https://i3tmnkgp2i.execute-api.us-west-2.amazonaws.com/upload-site>

### Add new sites

#### Request

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

#### Sample Response

    HTTP/1.1 200 OK
    Date: Fri, 22 May 2020 18:17:17 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 54
    Connection: close
    Apigw-Requestid: ____________

    {"message":"Added 1 new sites and 1 new site details"}

For sites with the same site ID, only a site detail entry will be made. If you run the above cURL command, you will most likely see 0 new sites added.

## Schema

This endpoint expects an array of objects named `data` in the POST body. See `schema.js` for more information on the expected format of the data.

    {
        "siteName": { "type": "string" }, // REQUIRED
        "siteStreetAddress": { "type": "string" }, // REQUIRED
        "siteCity": { "type": "string" }, // REQUIRED
        "siteState": { "type": "string" }, // REQUIRED
        "siteZip": { "type": "integer" }, // REQUIRED
        "siteCountry": { "type": "string" }, // REQUIRED
        "siteCounty": { "type": "string" },
        "siteNeighborhood": { "type": "string" },
        "siteType": { "type": "string" },
        "siteSubType": { "type": "string" },
        "lat": { "type": "number" },
        "lng": { "type": "number" },
        "EFROID": { "type": "string" },
        "publicContactMethod": { "type": "string" },
        "publicPhone": { "type": "string" },
        "publicEmail": { "type": "string" },
        "website": { "type": "string" },
        "socialMedia": { "type": "string" },
        "contactName": { "type": "string" },
        "contactPhone": { "type": "string" },
        "contactEmail": { "type": "string" },
        "status": { "type": "string" },
        "publicOpenness": { "type": "string" },
        "deliveryEligibility": { "type": "string" },
        "eligibilityRequirements": { "type": "string" },
        "hoursEligibility1": { "type": "string" },
        "hours1": { "type": "string" },
        "hoursEligibility2": { "type": "string" },
        "hours2": { "type": "string" },
        "hoursEligibility3": { "type": "string" },
        "hours3": { "type": "string" },
        "validUntil": { "type": "string" },
        "acceptsFoodDonations": { "type": "string" },
        "hasEnoughFood": { "type": "string" },
        "canReceiveBulk": { "type": "string" },
        "foodNeeds": { "type": "string" },
        "hasBabyFormula": { "type": "string" },
        "staffVolunteerNeeds": { "type": "string" },
        "recruitingAssistance": { "type": "string" },
        "otherNeeds": { "type": "string" },
        "covidChanges": { "type": "string" },
        "increasedDemandCauses": { "type": "string" },
        "totalFoodCommunityNeeds": { "type": "string" },
        "currentCapacity": { "type": "string" },
        "staffVolunteerReduction": { "type": "string" },
        "safetyPrecautions": { "type": "string" },
        "languages": { "type": "string" },
        "nearbyFoodPrograms": { "type": "string" },
        "notesGovRequests": { "type": "string" },
        "notesAnythingElse": { "type": "string" },
        "stockStatus": { "type": "string" },
        "reminderMethod": { "type": "string" },
    }
