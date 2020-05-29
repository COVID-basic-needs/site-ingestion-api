/*
 * Defines the data schema and functions for creating site/site detail objects 
 */
let { fromEmail } = require("./airtableConfig");

const updateMethod = "Upload V3: https://github.com/COVID-basic-needs/site-ingestion-api";

module.exports.dataSchema = {
    "id": "/dataSchema",
    "type": "object",
    "properties": {
        "siteName": { "type": "string" },
        "siteStreetAddress": { "type": "string" },
        "siteCity": { "type": "string" },
        "siteState": { "type": "string" },
        "siteZip": { "type": "integer" },
        "siteCountry": { "type": "string" },
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
    },
    "required": ["siteName", "siteStreetAddress", "siteCity", "siteCountry", "siteState", "siteZip"],
    "throwError": false
}


module.exports.populateSiteFields = function (site) {
    return {
        fields: {
            uploadedBy: { email: fromEmail },
            siteName: site.siteName,
            EFROID: site.EFROID,
            siteStreetAddress: site.siteStreetAddress,
            siteCity: site.siteCity,
            siteState: site.siteState,
            siteZip: site.siteZip ? site.siteZip + "" : null,
            siteCountry: site.siteCountry,
            siteCounty: site.siteCounty,
            siteNeighborhood: site.siteNeighborhood,
            siteType: site.siteType,
            siteSubType: site.siteSubType,
            lat: site.lat,
            lng: site.lng,
            createdMethod: updateMethod
        }
    };
}

module.exports.populateDetailsFields = function (site, id) {
    return {
        fields: {
            Site: [id],
            uploadedBy: { email: fromEmail },
            status: site.status,
            contactName: site.contactName,
            contactPhone: site.contactPhone ? site.contactPhone + "" : null,
            contactEmail: site.contactEmail,
            publicOpenness: site.publicOpenness,
            deliveryEligibility: site.deliveryEligibility,
            eligibilityRequirements: site.eligibilityRequirements,
            hoursEligibility1: site.hoursEligibility1,
            hours1: site.hours1,
            hoursEligibility2: site.hoursEligibility2,
            hours2: site.hours2,
            hoursEligibility3: site.hoursEligibility3,
            hours3: site.hours3,
            validUntil: site.validUntil,
            acceptsFoodDonations: site.acceptsFoodDonations,
            hasEnoughFood: site.hasEnoughFood,
            canReceiveBulk: site.canReceiveBulk,
            foodNeeds: site.foodNeeds,
            hasBabyFormula: site.hasBabyFormula,
            staffVolunteerNeeds: site.staffVolunteerNeeds,
            recruitingAssistance: site.recruitingAssistance,
            otherNeeds: site.otherNeeds,
            publicContactMethod: site.publicContactMethod,
            publicPhone: site.publicPhone ? site.publicPhone + "" : null,
            publicEmail: site.publicEmail,
            website: site.website,
            socialMedia: site.socialMedia,
            covidChanges: site.covidChanges,
            increasedDemandCauses: site.increasedDemandCauses,
            totalFoodCommunityNeeds: site.totalFoodCommunityNeeds,
            currentCapacity: site.currentCapacity,
            staffVolunteerReduction: site.staffVolunteerReduction,
            safetyPrecautions: site.safetyPrecautions,
            languages: site.languages,
            nearbyFoodPrograms: site.nearbyFoodPrograms,
            notesGovRequests: site.notesGovRequests,
            notesAnythingElse: site.notesAnythingElse ? site.notesAnythingElse + "" : null,
            createdMethod: updateMethod
        }
    };
}