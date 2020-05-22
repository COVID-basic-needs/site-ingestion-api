/**
 * Pushes data to Airtable SITES table, then push associated details to SITE_DETAILS
 */

const { detailsTable, sitesTable } = require("./airtableConfig");
const { populateSiteFields, populateDetailsFields } = require("./schema");

module.exports = async function(siteList){
    const total = siteList.length;

    try {
        originalSites = await fetchSiteTable();
    } catch (err) {
        // error fetching site table
        console.log(err);
        throw err;
    }
    // filter out the site details corresponding to existing sites to be uploaded separately
    const dupedSiteDetails = [];
    const newSites = [];

    // filter out duplicates from list
    siteList.map(site => { 
        const siteID = getSiteID(site);
        if (originalSites.has(siteID)) {
            // on duplicate, add site details (with row id) to separate list
            const details = populateDetailsFields(site, originalSites.get(siteID));
            dupedSiteDetails.push(details);
        } else {
            newSites.push(site);
        }
    }); 

    // promises to await on
    let promises = [];

    // Airtable's create API only allows 10 at a time, so we batch.
    // (there is a rate limit, but their SDK has builtin retry logic so we should be safe)
    for (let i = 0; i < newSites.length; i += 10) {
        const tenSites = newSites.slice(i, i + 10 < total ? i + 10 : total);
        
        // create a list of 10 site objects to be pushed to the table
        const tenSiteLocations = tenSites.map(site => populateSiteFields(site));
        
        let p = new Promise(function (resolve, reject) {
            sitesTable.create(tenSiteLocations, { typecast: true }, async (err, records) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                
                // create a list of the 10 site details objects
                const tenSiteDetails = [];
                for (let i = 0; i < records.length; i++) {
                    // create details field with corresponding site object and row id
                    tenSiteDetails.push(populateDetailsFields(tenSites[i], records[i].getId()));
                };

                // push details objects to Airtable
                detailsTable.create(tenSiteDetails, { typecast: true }, async (err, records) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    resolve();
                });
            });
        });
        
        promises.push(p);
    };

    // push details corresponded to duped sites
    for (let j = 0; j < dupedSiteDetails.length; j++){
        const tenDupedSiteDetails = dupedSiteDetails.slice(j, j + 10 < total ? j + 10 : total);
        
        let p = new Promise(function (resolve, reject) {
            detailsTable.create(tenDupedSiteDetails, { typecast: true }, async (err, records) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve();
            });
        });
        promises.push(p);
    }

    // wait on all promises to finish
    await Promise.all(promises);
    console.log(`Pushed ${newSites.length} rows to Airtable ${sitesTable.name} table and ${dupedSiteDetails.length + newSites.length} rows to the ${detailsTable.name} table.`);
    return [newSites.length, dupedSiteDetails.length + newSites.length];
};

// fetches the siteIDs from the sites table with pagination, returning a map of siteIDs => Airtable IDs
function fetchSiteTable() {
    // map of siteID to ID
    const sites = new Map();

    return new Promise(function (resolve, reject) {
        // this is inefficient, but the rate limiting makes checking for individual/batch conflicts unfeasible
        sitesTable.select({
            fields: ["siteID"],
            pageSize: 100,
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            records.forEach(function (record) {
                sites.set(record.get("siteID"), record.getId());
            });

            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.error(err);
                reject(err);
            }
            
            console.log(`Fetched ${sites.size} rows from the sites table`);
            resolve(sites);
        });
    });
}

// same formula as the one in AirTable to generate the "unique" site identifier
function getSiteID(site) {
    const joined = `${site.siteName} - ${site.siteStreetAddress}, ${site.siteCity} ${site.siteState} ${site.siteZip + ""}`;
    return joined.replace('\n', ' ');
}