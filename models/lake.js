const mongoose = require("mongoose"); 
const Comment = require('./comment');

const lakeSchema= new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

//pre hook 
lakeSchema.pre('remove', async function() {
	await Comment.deleteMany({
		_id: {
			$in: this.comments
		}
	});
});
 
module.exports = mongoose.model("Lake",lakeSchema);


