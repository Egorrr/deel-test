const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Job extends Model {
		static associate(models) {
			this.belongsTo(models.Contract);
		}
	}

	Job.init({
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		price: {
			type: DataTypes.DECIMAL(12, 2),
			allowNull: false
		},
		paid: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		paymentDate: {
			type: DataTypes.DATE
		}
	}, {
		sequelize,
		modelName: 'Job'
	});

	return Job;
};
