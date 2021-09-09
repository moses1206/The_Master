const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const ServiceSchema = new Schema(
  {
    sv_category: { type: String, required: true },
    sv_name: { type: String, required: true },
    sv_detail: { type: String, required: true },
    sv_address: { type: String, required: true },
    sv_short_introdution: { type: String, required: true },
    sv_level: { type: Number, required: true },
    sv_order: { type: Number, required: true },
    master: { type: ObjectId, required: true, ref: 'master' },
  },
  { timestamps: true }
);

const Service = model('service', ServiceSchema);

module.exports = { Service };
