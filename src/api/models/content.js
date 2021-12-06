import mongoose from "mongoose";
import Comment from "./comment.js";
import User from "./user.js";
const { Schema, model } = mongoose;

const contentSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Content needs to have a unique name"],
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
      enum: ["video", "audio", "either"],
      required: true,
    },
    contentType: {
      type: String,
      enum: ["podcast", "movie", "serie", "videos"],
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User (owner) is required to make content"],
    },
  },
  {
    toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
    toJSON: { virtuals: true },
  }
);
// Schema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

contentSchema.set(
  "toJSON",
  {
    virtuals: true,
  },
  "toObject",
  { virtuals: true }
);

const Content = model("Content", contentSchema);
export default Content;
