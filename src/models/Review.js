const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const ReviewSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: 'user' },
    service: { type: ObjectId, required: true, ref: 'service' },
  },
  { timestamps: true }
);

const Review = model('review', ReviewSchema);

module.exports = { Review };
