var assert = require('assert');
const apiHandler = require('../index').handler;


describe('POST body checks', function() {
    it('Should return 400 when no body present', async function() {
        let req = {}

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 400);
    });
    
    it('Should return 415 when body is invalid', async function() {
        let req = { body: "I'm not a JSON object" };

        let res = await apiHandler(req);
        assert.equal(res.statusCode, 415);
    });
});