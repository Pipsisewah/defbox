// test/vulnerable_idor.test.js

import { strict as assert } from 'assert';
import supertest from 'supertest';

// Base URL for the running service (assuming it's accessible at localhost:3000)
const baseUrl = 'http://defboxlocaltarget:3005';

describe('IDOR Vulnerability Tests', () => {
    describe('user/:id', () => {
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
        it('should block access if no token is provided', async () => {
            const token1 = 'authToken1';
            const response = await supertest(baseUrl)
                .get('/secure/user/1')
                .expect(403);
        })
    });
    describe('UpdateProfile', () => {
        it('should be allowed to update the profile of another employee in the company', async () => {
            const token1 = 'authToken1';
            const postData = {
                newProfileData: 'testing',
                userId: 3
            };
            const update = await supertest(baseUrl)
                .post('/secure/updateProfile')
                .set('Authorization', `Bearer ${token1}`)
                .send(postData)
                .expect(200);
            const response = await supertest(baseUrl)
                .get('/secure/user/3')
                .set('Authorization', `Bearer ${token1}`)
                .expect(200);

            assert.equal(response.body.user.profile, 'testing');
        });
        it('should not be allowed to update the profile of another user outside the company', async () => {
            const token1 = 'authToken1';
            const postData = {
                newProfileData: 'testing',
                userId: 2
            };
            const update = await supertest(baseUrl)
                .post('/secure/updateProfile')
                .set('Authorization', `Bearer ${token1}`)
                .send(postData)
                .expect(403);
            const response = await supertest(baseUrl)
                .get('/secure/user/2')
                .set('Authorization', `Bearer ${token1}`)
                .expect(403);
        });
    });
    describe('getUserData', () => {
        it('should be able to get a coworkers user data', async () => {
            const token1 = 'authToken1';
            const response = await supertest(baseUrl)
                .get('/secure/user/3')
                .set('Authorization', `Bearer ${token1}`)
                .expect(200);
            assert.equal(response.body.user.secret, 'Manager Secret');
        })
        it('should not be able to get the user data outside my company', async () => {
            const token1 = 'authToken1';
            const response = await supertest(baseUrl)
                .get('/secure/user/2')
                .set('Authorization', `Bearer ${token1}`)
                .expect(403);
        })
    });
    describe('Get File', () => {
        it('should allow a user to get a file that exists within their company', async () => {
            const token1 = 'authToken1';
            const response = await supertest(baseUrl)
                .get('/secure/files/secret.txt')
                .set('Authorization', `Bearer ${token1}`)
                .expect(200);
            assert.equal(response.text, 'S3c12ET');
        })
        it('should block a user to get a file that exists within another company', async () => {
            const token1 = 'authToken1';
            const response = await supertest(baseUrl)
                .get('/secure/files/secondFile')
                .set('Authorization', `Bearer ${token1}`)
                .expect(403);
        })
    });



});
