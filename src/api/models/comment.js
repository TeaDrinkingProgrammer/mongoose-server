import mongoose from "mongoose";
const { Schema, model } = mongoose;
const commentSchema = new Schema(
  {
    comment_text: {
      type: String,
      required: true,
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
    firstname: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
commentSchema.virtual("karma").get(function () {
  //this verwijst naar het document. this in js is dynamisch met deze notatie (this verwijst dan naar aanroeper van de functie), met fat arrow is ie statisch
  return this.upvote - downvote;
});
const Comment = model("Comment", commentSchema);
export default Comment;
