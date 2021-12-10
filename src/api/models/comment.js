import mongoose from "mongoose";
const { Schema, model } = mongoose;
const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: true,
    },
    votes: [
      {
        userId: Schema.Types.ObjectId,
        type: String,
        default: [],
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User (owner) is required to make comment"],
    },
    content: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: [true, "Content reference is required to make comment"],
    },
  },
  {
    toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
commentSchema.virtual("votesCount").get(function () {
  return this.votes.length;
});
const Comment = model("Comment", commentSchema);
export default Comment;
