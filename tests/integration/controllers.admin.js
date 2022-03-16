const { assert } = require('chai');
const request = require('supertest');
const { Op, literal, fn, col } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');
const { Job, Contract, Profile } = require('../../src/models/model');

const ADMIN_TOKEN_HEADER = 'admin_key';
const ADMIN_TOKEN = 123;

describe('admin.js', () => {
	describe('GET /best-profession', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).get('/api/admin/best-profession').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not accept invalid query params', () => {
			const invalidStartDate = 11111;
			const validEndDate = new Date();

			return request(app)
				.get('/api/admin/best-profession')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: invalidStartDate,
					end: validEndDate.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should not accept end date that is before start date', async () => {
			const startDate = new Date();
			const endDate = new Date();

			endDate.setDate(endDate.getDate() - 7);

			return request(app)
				.get('/api/admin/best-profession')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: startDate.toISOString(),
					end: endDate.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should not accept end date that is same as start date', async () => {
			const date = new Date();

			return request(app)
				.get('/api/admin/best-profession')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: date.toISOString(),
					end: date.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should return the profession that earned the most money in the provided date range', async () => {
			const startDate = new Date('2020-08-09T19:11:26.737Z');
			const endDate = new Date('2020-08-18T19:11:26.737Z');

			const amountPaidByContractId = await _getEarningsPerContractInDateRange(startDate, endDate);
			const contractIds = Object.keys(amountPaidByContractId);
			const contractsInDateRange = await Contract.findAll({
				where: { id: contractIds },
				attributes: ['id'],
				include: {
					model: Profile,
					as: 'Contractor',
					required: true,
					attributes: ['profession']
				}
			});

			const amountsPerProfession = contractsInDateRange.reduce((acc, contract) => {
				const contractId = contract.id;
				const profession = contract.Contractor.profession;

				acc[profession] = acc[profession] || 0;
				acc[profession] += amountPaidByContractId[contractId];

				return acc;
			}, {});

			const [[expectedProfession, expectedAmountReceived]] = Object.entries(amountsPerProfession)
				.sort(([professionA, amountA], [professionB, amountB]) => (amountA > amountB) ? -1 : 1);

			const { body: bestProfession } = await request(app)
				.get('/api/admin/best-profession')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: startDate.toISOString(),
					end: endDate.toISOString()
				})
				.expect(StatusCodes.OK);

			assert.isObject(bestProfession, 'should return best profession');
			assert.strictEqual(bestProfession.profession, expectedProfession, 'should return expected best profession');
			assert.strictEqual(bestProfession.amountReceived, expectedAmountReceived,
				'should return expected received amount');
		});
	});

	describe('GET /best-clients', () => {
		it('should be protected from unauthenticated access', () => {
			return request(app).get('/api/admin/best-clients').expect(StatusCodes.UNAUTHORIZED);
		});

		it('should not accept invalid query params', () => {
			const invalidStartDate = 11111;
			const validEndDate = new Date();

			return request(app)
				.get('/api/admin/best-clients')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: invalidStartDate,
					end: validEndDate.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should not accept end date that is before start date', async () => {
			const startDate = new Date();
			const endDate = new Date();

			endDate.setDate(endDate.getDate() - 7);

			return request(app)
				.get('/api/admin/best-clients')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: startDate.toISOString(),
					end: endDate.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should not accept end date that is same as start date', async () => {
			const date = new Date();

			return request(app)
				.get('/api/admin/best-clients')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: date.toISOString(),
					end: date.toISOString()
				})
				.expect(StatusCodes.BAD_REQUEST);
		});

		it('should return clients the paid the most for jobs in the provided date range', async () => {
			const startDate = new Date('2020-08-09T19:11:26.737Z');
			const endDate = new Date('2020-08-18T19:11:26.737Z');
			const limit = 3;

			const amountPaidByContractId = await _getEarningsPerContractInDateRange(startDate, endDate);
			const contractIds = Object.keys(amountPaidByContractId);
			const contractsInDateRange = await Contract.findAll({
				where: { id: contractIds },
				attributes: ['id', 'ClientId', [literal('firstName || " " || lastName'), 'fullName']],
				include: {
					model: Profile,
					as: 'Client',
					required: true,
					attributes: []
				},
				raw: true,
				subQuery: false
			});

			const amountsPerClient = contractsInDateRange.reduce((acc, contract) => {
				const contractId = contract.id;
				const clientId = contract.ClientId;
				const fullName = contract.fullName;

				acc[clientId] = acc[clientId] || { id: clientId, fullName, paid: 0 };
				acc[clientId].paid += amountPaidByContractId[contractId];

				return acc;
			}, {});

			const expectedBestClients = Object.values(amountsPerClient)
				.sort(({ id: idA, paid: paidA }, { id: idB, paid: paidB }) => {
					if (paidA === paidB) {
						return idA - idB;
					}

					return (paidA > paidB) ? -1 : 1;
				}).slice(0, limit);

			const { body: bestClients } = await request(app)
				.get('/api/admin/best-clients')
				.set(ADMIN_TOKEN_HEADER, ADMIN_TOKEN)
				.query({
					start: startDate.toISOString(),
					end: endDate.toISOString(),
					limit
				})
				.expect(StatusCodes.OK);

			assert.isArray(bestClients, 'should return best clients array');
			assert.strictEqual(bestClients.length, limit, 'should return expected number of professions');
			assert.sameDeepOrderedMembers(bestClients, expectedBestClients, 'should return expected best clients');
		});
	});

	async function _getEarningsPerContractInDateRange(startDate, endDate) {
		const earningsPerContract = await Job.findAll({
			group: ['ContractId'],
			attributes: ['ContractId', [fn('sum', col('price')), 'totalAmount']],
			where: {
				paymentDate: {
					[Op.between]: [startDate, endDate]
				}
			},
			raw: true
		});

		return earningsPerContract.reduce((acc, { ContractId, totalAmount }) => {
			acc[ContractId] = totalAmount;

			return acc;
		}, {});
	}
});
