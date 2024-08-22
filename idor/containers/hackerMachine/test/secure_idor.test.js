// test/vulnerable_idor.test.js

import { strict as assert } from 'assert';
import supertest from 'supertest';

// Base URL for the running service (assuming it's accessible at localhost:3000)
const baseUrl = 'http://defboxlocaltarget:3005';

describe('IDOR Vulnerability Tests', () => {
    it('should block access to another user', async () => {
        const token1 = 'authToken1';
        const token2 = 'authToken2';
        const response1 = await supertest(baseUrl)
            .get('/secure/user/1')
            .set('Authorization', `Bearer ${token1}`)
            .expect(200);
        assert.equal(response1.body.user.secret, 'Admin Secret');
        const response2 = await supertest(baseUrl)
            .get('/secure/user/1')
            .set('Authorization', `Bearer ${token2}`)
            .expect(403);
    });


});
