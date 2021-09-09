const { Schema, model } = require('mongoose');

const MasterSchema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    basicInfo: {
      authentication: {
        type: Boolean,
        required: true,
      },
      fromtime: { type: String, required: true },
      totime: { type: String, required: true },
      payment: { type: Array, required: true },
      // Payment 모델 생성
    },
    moreInfo: {
      category: { type: String, required: true },
      career: { type: String, required: true },
      employeesNum: { type: Number, required: true },
      businessRegistration: { type: Boolean, required: true },
      certificate: { type: String, required: true },
    },
    address: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true },
    token: { type: String, required: true },
  },
  //   timestamps: true =>모델의 CreatedAt , UpdatedAt 생성
  { timestamps: true }
);

const Master = model('master', MasterSchema);

module.exports = { Master };
