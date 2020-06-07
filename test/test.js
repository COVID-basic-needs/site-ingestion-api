var assert = require('assert');
const apiHandler = require('../index').handler;

// timestamp used to dedupe
const timestamp = new Date().toJSON();

const testSite = {
    siteName: "testSite" + timestamp,
    siteStreetAddress: "123 Test Ave",
    siteCity: "TestVille",
    siteCountry: "USA",
    siteState: "TS",
    siteZip: "12345",
    contactName: "Test Detail 1/2"
}

describe('POST body checks', function () {

    it('Should return 404 for unsupported endpoints', async function () {
        let req = { path: "/bad-endpoint" };
        let res = await apiHandler(req);
        assert.equal(res.statusCode, 404);
    });

    it('Should return 400 when no body present or is empty', async function () {
        let req = { path: "/form-upload" };
        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);

        req = { path: "/upload-site", body: "" };
        res = await apiHandler(req);
        assert.equal(res.statusCode, 400);

        req = {
            path: "/upload-site",
            body: JSON.stringify({
                data: []
            })
        };
        res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });

    it('Should return 400 when body cannot be parsed', async function () {
        let req = {
            path: "/upload-site",
            body: '[,"I", "Am", "Invalid",]'
        };

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });


    it('Should return 400 for if data does not conform to schema', async function () {
        let req = {
            path: "/upload-site",
            body: JSON.stringify({
                data: [{ siteName: "I lack required fields" }]
            })
        };

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });
});


describe('Upload basic site and details to /upload-site', function () {

    it('Should successfully upload 1 site and 1 site detail', async function () {
        let req = {
            path: "/upload-site",
            body: JSON.stringify({
                data: [testSite]
            }),
        }
        let res = await apiHandler(req);

        assert.equal(res.statusCode, 200);
        let message = JSON.parse(res.body).message;
        assert.equal(message, `Added 1 new sites and 1 new site details`);
    });

    it('Should recognize duplicate and only upload 1 site detail', async function () {
        testSite2 = testSite;
        testSite2.contactName = "Test Detail 2/2";

        let req = {
            path: "/upload-site",
            body: JSON.stringify({
                data: [testSite2]
            }),
        }
        let res = await apiHandler(req);

        assert.equal(res.statusCode, 200);
        let message = JSON.parse(res.body).message;
        assert.equal(message, `Added 0 new sites and 1 new site details`);

    });
});

describe('Upload basic site and details to /form-upload', function () {
    it('Should recognize duplicate and only upload 1 site detail', async function () {
        testSiteFromForm = testSite;
        testSiteFromForm.siteName = "testSiteFromForm" + timestamp;
        testSiteFromForm.contactName = "Test Detail 1/1";

        let req = {
            path: "/form-upload",
            body: JSON.stringify(testSiteFromForm),
        }
        let res = await apiHandler(req);

        assert.equal(res.statusCode, 200);
        let message = JSON.parse(res.body).message;
        assert.equal(message, `Added 1 new sites and 1 new site details`);
    });
});