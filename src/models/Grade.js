const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const GradeSchema = new Schema(
  {
    content: { type: Number, required: true },
    user: { type: ObjectId, required: true, ref: 'user' },
    service: { type: ObjectId, required: true, ref: 'service' },
  },
  { timestamps: true }
);

const Grade = model('grade', GradeSchema);

module.exports = { Grade };
