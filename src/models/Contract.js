const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Contract extends Model {
		static associate(models) {
			this.belongsTo(models.Profile, { as: 'Contractor' });
			this.belongsTo(models.Profile, { as: 'Client' });
			this.hasMany(models.Job);
		}
	}

	Contract.init({
		terms: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('new', 'in_progress', 'terminated')
		}
	}, {
		sequelize,
		modelName: 'Contract'
	});

	return Contract;
};
