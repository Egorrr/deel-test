const { assert } = require('chai');
const { Op } = require('sequelize');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');
const { Contract } = require('../../src/models/model');
const contractStatuses = require('../../src/enums/contractStatuses');

const PROFILE_ID_HEADER = 'profile_id';

describe('contracts.js', () => {
	describe('GET /', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).get('/api/contracts').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should return empty array when no contracts found', async () => {
			const profileIdWithoutContracts = 5;

			const { body: contracts } = await request(app)
				.get('/api/contracts')
				.set(PROFILE_ID_HEADER, profileIdWithoutContracts)
				.expect(StatusCodes.OK);

			assert.isArray(contracts, 'should return array of requested contracts');
			assert.strictEqual(contracts.length, 0, 'should return empty array');
		});

		it('should return contracts belonging to profile', async () => {
			const profileId = 6;
			const expectedProfileContracts = await Contract.findAll({
				where: {
					status: { [Op.ne]: contractStatuses.TERMINATED },
					[Op.or]: [
						{ ClientId: profileId },
						{ ContractorId: profileId }
					]
				},
				attributes: ['id']
			});

			const { body: contracts } = await request(app)
				.get('/api/contracts')
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.OK);

			const expectedContractIds = expectedProfileContracts.map((c) => c.id);
			const actualContractIds = contracts.map((c) => c.id);

			assert.isArray(contracts, 'should return array of requested contracts');
			assert.sameMembers(actualContractIds, expectedContractIds, 'should return expected contracts ids');
		});
	});

	describe('GET /:id', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).get('/api/contracts/1').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not allow to request contract by invalid id', async () => {
			const invalidContractId = -1;
			const profileId = 1;

			await request(app)
				.get(`/api/contracts/${invalidContractId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.BAD_REQUEST);
		});

		it(`should not allow to request contract that don't belong to profile`, async () => {
			const contractId = 1;
			const profileId = 8;

			await request(app)
				.get(`/api/contracts/${contractId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.NOT_FOUND);
		});

		it(`should return Not Found error if contract don't exist`, async () => {
			const contractId = Number.MAX_SAFE_INTEGER;
			const profileId = 1;

			await request(app)
				.get(`/api/contracts/${contractId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.NOT_FOUND);
		});

		it('should return contract by id', async () => {
			const contractId = 1;
			const profileId = 1;

			const { body: contract } = await request(app)
				.get(`/api/contracts/${contractId}`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.OK);

			assert.ok(contract, 'should return requested contract');
			assert.strictEqual(contract.id, contractId, 'should return contract with requested id');
			assert.ok(contract.ClientId === profileId || contract.ContractorId === profileId,
				'contract should belong to profile');
		});
	});
});
