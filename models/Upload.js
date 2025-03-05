const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Upload=sequelize.define(
    'Upload',
    {
        title:{
            type:DataTypes.STRING,
            allowNull:true,
        },

        upload_time:{
            type:DataTypes.STRING,
            allowNull:true,
        },

        badge:{
            type:DataTypes.STRING,
            allowNull:true,
        },

        file_format:{
            type:DataTypes.STRING,
            allowNull:true,
        },

        file_size:{
            type:DataTypes.STRING,
            allowNull:true,
        },

        user_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        }
    },
    {
        sequelize,
        modelName:"Upload",
        tableName:'upload',
        underscored:true,
        timestamps:true,
    }
)

module.exports = Upload;