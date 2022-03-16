const { assert } = require('chai');
const { Op } = require('sequelize');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');
const { Job, Contract } = require('../../src/models/model');
const contractStatuses = require('../../src/enums/contractStatuses');

const PROFILE_ID_HEADER = 'profile_id';

describe('jobs.js', () => {
	describe('GET /unpaid', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).get('/api/jobs/unpaid').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should return empty jobs array when no contracts found', async () => {
			const profileIdWithoutContracts = 5;

			const { body: jobs } = await request(app)
				.get('/api/jobs/unpaid')
				.set(PROFILE_ID_HEADER, profileIdWithoutContracts)
				.expect(StatusCodes.OK);

			assert.isArray(jobs, 'should return array of requested jobs');
			assert.strictEqual(jobs.length, 0, 'should return empty array');
		});

		it('should return all unpaid jobs belonging to profile only for the active contracts', async () => {
			const profileId = 2;

			const expectedUnpaidJobs = await Job.findAll({
				where: {
					paid: false
				},
				include: {
					model: Contract,
					where: {
						status: { [Op.ne]: contractStatuses.TERMINATED },
						[Op.or]: [
							{ ClientId: profileId },
							{ ContractorId: profileId }
						]
					},
					required: true,
					attributes: []
				},
				attributes: ['id']
			});

			const { body: jobs } = await request(app)
				.get('/api/jobs/unpaid')
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.OK);

			const expectedJobIds = expectedUnpaidJobs.map((c) => c.id);
			const actualJobIds = jobs.map((c) => c.id);

			assert.isArray(jobs, 'should return array of requested jobs');
			assert.sameMembers(actualJobIds, expectedJobIds, 'should return expected job ids');
			assert.ok(actualJobIds.every((j) => !j.paid), 'all jobs should be unpaid');
		});
	});
});
