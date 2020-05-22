var assert = require('assert');
const apiHandler = require('../index').handler;

describe('POST body checks', function() {
    it('Should return 400 when no body present or is empty', async function() {
        let req = {}
        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);

        req = { body: "" };
        res = await apiHandler(req);
        assert.equal(res.statusCode, 400);

        req = {
            body: JSON.stringify({
                data: []
            })
        };
        res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });

    it('Should return 400 when body cannot be parsed', async function () {
        let req = {
            body: '[,"I", "Am", "Invalid",]'
        };

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });


    it('Should return 400 for if data does not conform to schema', async function () {
        let req = {
            body: JSON.stringify({
                data: [{siteName: "I lack required fields"}]
            })
        };

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });
});


describe('Upload basic site and details', function () {
    // used to test deduping
    let timestamp = new Date().toJSON();

    it('Should successfully upload 1 site and 1 site detail', async function () {
        let req = {
            body: JSON.stringify({
                data: [{
                    siteName: "testSite" + timestamp,
                    siteStreetAddress: "123 Test Ave",
                    siteCity: "TestVille",
                    siteCountry: "USA",
                    siteState: "TS",
                    siteZip: 12345,
                    contactName: "Test Detail 1/2"
                }]
            }),
        }
        let res = await apiHandler(req);

        assert.equal(res.statusCode, 200);
        let message = JSON.parse(res.body).message;
        assert.equal(message, `Added 1 new sites and 1 new site details`);
    });

    it('Should recognize duplicate and only upload 1 site detail', async function () {
        let req = {
            body: JSON.stringify({
                data: [{
                    siteName: "testSite" + timestamp,
                    siteStreetAddress: "123 Test Ave",
                    siteCity: "TestVille",
                    siteCountry: "USA",
                    siteState: "TS",
                    siteZip: 12345,
                    contactName: "Test Detail 2/2"
                }]
            }),
        }
        let res = await apiHandler(req);

        assert.equal(res.statusCode, 200);
        let message = JSON.parse(res.body).message;
        assert.equal(message, `Added 0 new sites and 1 new site details`);
    });
});