/**
 * Pushes data to Airtable Sites table, then push associated details to Site Details table.
 *
 * Dependant on password from CLI tool for /upload-site to not push the actual base rather than TEST.
 */

require('dotenv').config();
const Airtable = require('airtable');
const { populateSiteFields, populateDetailsFields } = require('../site-ingestion-schema/schema');

const updateMethod = 'Upload V4: github.com/COVID-basic-needs/site-ingestion-api';

module.exports = async (siteList, email, password) => {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(password === process.env.PW ? process.env.AIRTABLE_BASE_ID : process.env.TEST_BASE_ID);

  const sitesTable = base(process.env.AIRTABLE_SITES_TABLE);
  const detailsTable = base(process.env.AIRTABLE_SITE_DETAILS);
  const total = siteList.length;
  let originalSites;

  console.log('Begin push');
  try {
    originalSites = await fetchSiteTable(sitesTable);
  } catch (err) {
    // error fetching site table
    console.log(err);
    throw err;
  }
  // filter out the site details corresponding to existing sites to be uploaded separately
  const dupedSiteDetails = [];
  const newSites = [];

  // filter out duplicates from list
  siteList.map((site) => {
    const siteID = getSiteID(site);
    if (originalSites.has(siteID)) {
      // on duplicate, add site details (with row id) to separate list
      console.log(`FROM EMAIL: ${email}`);
      const details = populateDetailsFields(site, originalSites.get(siteID), email, updateMethod);
      dupedSiteDetails.push(details);
    } else {
      console.log(`FROM EMAIL: ${email}`);
      newSites.push(site);
    }
  });

  // promises to await on
  const promises = [];

  // Airtable's create API only allows 10 at a time, so we batch.
  // (there is a rate limit, but their SDK has builtin retry logic so we should be safe)
  for (let i = 0; i < newSites.length; i += 10) {
    const tenSites = newSites.slice(i, i + 10 < total ? i + 10 : total);

    // create a list of 10 site objects to be pushed to the table
    const tenSiteLocations = tenSites.map((site) => populateSiteFields(site, email, updateMethod));

    const p = new Promise((resolve, reject) => {
      sitesTable.create(tenSiteLocations, { typecast: true }, async (err, records) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        // create a list of the 10 site details objects
        const tenSiteDetails = [];
        for (let i = 0; i < records.length; i += 1) {
          // create details field with corresponding site object and row id
          tenSiteDetails.push(populateDetailsFields(tenSites[i], records[i].getId(), email, updateMethod));
        }

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
  }

  // push details corresponded to duped sites
  for (let j = 0; j < dupedSiteDetails.length; j += 1) {
    const tenDupedSiteDetails = dupedSiteDetails.slice(j, j + 10 < total ? j + 10 : total);

    const p = new Promise((resolve, reject) => {
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
  try {
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
    throw err;
  }
  console.log(`Pushed ${newSites.length} rows to Airtable ${sitesTable.name} table and ${dupedSiteDetails.length + newSites.length} rows to the ${detailsTable.name} table.`);
  return [newSites.length, dupedSiteDetails.length + newSites.length];
};

// fetches the siteIDs from the sites table with pagination, returning a map of siteIDs => Airtable IDs
function fetchSiteTable (table) {
  // map of siteID to ID
  const sites = new Map();

  return new Promise((resolve, reject) => {
    // this is inefficient, but the rate limiting makes checking for individual/batch conflicts unfeasible
    table.select({
      fields: ['siteID'],
      pageSize: 100
    }).eachPage((records, fetchNextPage) => {
      // This function (`page`) will get called for each page of records.
      records.forEach((record) => {
        sites.set(record.get('siteID'), record.getId());
      });

      fetchNextPage();
    }, (err) => {
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
function getSiteID (site) {
  const joined = `${site.siteName} - ${site.siteStreetAddress}, ${site.siteCity} ${site.siteState} ${`${site.siteZip}`}`;
  return joined.replace('\n', ' ');
}
