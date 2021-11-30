import mongoose from "mongoose";
const { Schema, model } = mongoose;

const contentSchema = new Schema({
  name: {
    type: String,
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
});
const Content = model("Content", contentSchema);
export default Content;
