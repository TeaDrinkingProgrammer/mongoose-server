import mongoose from 'mongoose'
const { Schema, model } = mongoose
var validateEmail = function (email) {
	var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
	return re.test(email)
}
const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: 'Email address is required',
			validate: [validateEmail, 'Please enter a valid email address'],
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please enter a valid email address',
			],
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
		toJSON: { virtuals: true },
	}
)
userSchema.pre('findOneAndUpdate', function (next) {
	this.options.runValidators = true
	next()
})
const User = model('User', userSchema)
export default User
