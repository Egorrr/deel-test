const { assert } = require('chai');
const { Op } = require('sequelize');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');
const { Job, Contract, Profile } = require('../../src/models');
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
						status: contractStatuses.IN_PROGRESS,
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

	describe('POST /jobs/:job_id/pay', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).post('/api/jobs/1/pay').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not accept invalid job id', () => {
			const invalidJobId = 'aaa';
			const profileId = 2;

			return request(app)
				.post(`/api/jobs/${invalidJobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should not allow to modify Jobs that are not related to profile', () => {
			const jobId = 2;
			const profileId = 2;

			return request(app)
				.post(`/api/jobs/${jobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not allow to pay for already paid jobs', () => {
			const paidJobId = 6;
			const profileId = 2;

			return request(app)
				.post(`/api/jobs/${paidJobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.CONFLICT);
		});

		it('should not allow to pay if profile belongs to contractor', () => {
			const jobId = 5;
			const profileId = 6;

			return request(app)
				.post(`/api/jobs/${jobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not allow to pay if client balance is smaller than the job price', () => {
			const jobId = 5;
			const profileId = 4;

			return request(app)
				.post(`/api/jobs/${jobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.CONFLICT);
		});

		it('should perform job payment process', async () => {
			const jobId = 1;
			const profileId = 1;

			const job = await _getJobWithRelatedProfiles(jobId);
			const jobPrice = job.price;
			const { Client: client, Contractor: contractor } = job.Contract;

			assert.isFalse(job.paid, 'job should not be paid');
			assert.isNull(job.paymentDate, 'job should not have payment Date');

			await request(app)
				.post(`/api/jobs/${jobId}/pay`)
				.set(PROFILE_ID_HEADER, profileId)
				.expect(StatusCodes.OK);

			const updatedJob = await _getJobWithRelatedProfiles(jobId);
			const { Client: updatedClient, Contractor: updatedContractor } = updatedJob.Contract;

			assert.ok(updatedJob.paid, 'job should be paid');
			assert.ok(updatedJob.paymentDate, 'job should have payment date');
			assert.strictEqual(updatedClient.balance + jobPrice, client.balance,
				'should take job price from client balance');
			assert.strictEqual(updatedContractor.balance - jobPrice, contractor.balance,
				'should add job price to contractor balance');
		});
	});

	/**
	 * Gets job with related Profile models
	 * @param {Number} jobId Job id
	 * @returns {Promise<Job>} Job Promise
	 * @private
	 */
	function _getJobWithRelatedProfiles(jobId) {
		return Job.findByPk(jobId, {
			include: {
				model: Contract,
				include: [
					{
						model: Profile,
						as: 'Client'
					},
					{
						model: Profile,
						as: 'Contractor'
					}
				]
			}
		});
	}
});
