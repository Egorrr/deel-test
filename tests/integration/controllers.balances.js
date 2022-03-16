const { assert } = require('chai');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');
const { Profile } = require('../../src/models/model');

const PROFILE_ID_HEADER = 'profile_id';

describe('balances.js', () => {
	describe('POST /deposit/:userId', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).post('/api/balances/deposit/1').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not accept invalid user id', () => {
			const invalidUserId = 'aaa';
			const profileId = 2;

			return request(app)
				.post(`/api/balances/deposit/${invalidUserId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.BAD_REQUEST);
		});

		it(`should not allow to deposit money someone else's account`, () => {
			const userId = 1;
			const profileId = 2;
			const amount = 10;

			return request(app)
				.post(`/api/balances/deposit/${userId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.send({ amount })
				.expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not allow to deposit amount that exceeds 25% of Profile debt', () => {
			const userId = 2;
			const profileId = 2;
			const amount = Number.MAX_SAFE_INTEGER;

			return request(app)
				.post(`/api/balances/deposit/${userId}`)
				.send({ amount })
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.CONFLICT);
		});

		it('should not allow to deposit amount to contractor account', () => {
			const userId = 5;
			const profileId = 5;
			const amount = 15;

			return request(app)
				.post(`/api/balances/deposit/${userId}`)
				.send({ amount })
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.UNAUTHORIZED);
		});

		it('should deposit money into the balance of a client', async () => {
			const userId = 1;
			const profileId = 1;
			const amount = 15;

			const profile = await Profile.findByPk(userId);

			const { body: result } = await request(app)
				.post(`/api/balances/deposit/${userId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.send({ amount })
				.expect(StatusCodes.OK);

			const updatedProfile = await Profile.findByPk(userId);
			assert.strictEqual(updatedProfile.balance - amount, profile.balance,
				'should add specified amount to client balance');
			assert.strictEqual(result.id, userId, 'should return updated Profile id');
			assert.strictEqual(result.balance, updatedProfile.balance, 'should return updated Profile balance');
		});
	});
});
