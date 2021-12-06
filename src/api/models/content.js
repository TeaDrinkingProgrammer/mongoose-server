import mongoose from "mongoose";
import Comment from "./comment";
const { Schema, model } = mongoose;

const contentSchema = new Schema({
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
  comments: [Comment],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Content = model("Content", contentSchema);
export default Content;
