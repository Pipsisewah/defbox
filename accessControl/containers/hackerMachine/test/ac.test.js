// test/vulnerable_idor.test.js

import { strict as assert } from 'assert';
import supertest from 'supertest';

// Base URL for the running service (assuming it's accessible at localhost:3000)
const baseUrl = 'http://defboxacloadbalancer';

describe('Access Control Violations', () => {
    it('simple test', async () => {
        const response = await supertest(baseUrl)
            .get('/test')
            .expect(200);

        assert.equal(response.body, 'Response!');
    });


    // Add more test cases as needed
});
