import mongoose from 'mongoose'
const { Schema, model } = mongoose

const contentSchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, 'Content needs to have a unique name'],
			required: true,
		},
		tags: [
			{
				type: String,
			},
		],
		inProduction: {
			type: Boolean,
			required: true,
		},
		platforms: [
			{
				name: {
					type: String,
					required: true,
				},
				link: {
					type: String,
					required: true,
				},
			},
		],
		contentInterface: {
			type: String,
			enum: ['video', 'audio', 'either'],
			required: true,
		},
		contentType: {
			type: String,
			enum: ['podcast', 'movie', 'serie', 'videos'],
			required: true,
		},
		websiteLink: {
			type: String,
		},
		language: {
			type: String,
			required: true,
		},
		targetLanguage: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User (owner) is required to make content'],
		},
	},
	{
		toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
		toJSON: { virtuals: true },
	}
)
// Schema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

contentSchema.set(
	'toJSON',
	{
		virtuals: true,
	},
	'toObject',
	{ virtuals: true }
)
contentSchema.pre('findOneAndUpdate', function (next) {
	this.options.runValidators = true
	next()
})
contentSchema.pre('remove', async function (next) {
	const contentList = mongoose.Model('ContentList')
	const comment = mongoose.Model('Model')
	await contentList.updateMany({}, { $pull: { content: this._id } })
	await comment.updateMany({}, { $pull: { content: this._id } })
	next()
})
const Content = model('Content', contentSchema)
export default Content
