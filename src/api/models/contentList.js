import mongoose from "mongoose";
const { Schema, model } = mongoose;
const contentListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toObject: { virtuals: true }, //toObject gaat over de omzetting van mongoose object naar javascript object
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
const ContentList = model("ContentList", contentListSchema);
export default ContentList;
