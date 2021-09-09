const { Router } = require('express');
const masterRouter = Router();
const { Master } = require('../models');
const mongoose = require('mongoose');

masterRouter.get('/', async (req, res) => {
  try {
    const masters = await Master.find({});
    return res.send({ masters });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

masterRouter.get('/:masterId', async (req, res) => {
  try {
    const { masterId } = req.params;
    if (!mongoose.isValidObjectId(masterId))
      return res.status(400).send({ err: 'invalid masterId' });
    const master = await Master.findOne({ _id: masterId });
    return res.send({ master });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

masterRouter.post('/', async (req, res) => {
  try {
    let { username, gender, email, password, phone, basic_info, more_info } =
      req.body;
    if (!username) return res.status(400).send({ err: 'username is required' });
    if (!gender) return res.status(400).send({ err: 'gender is required' });
    if (!email) return res.status(400).send({ err: 'email is required' });
    if (!password) return res.status(400).send({ err: 'password is required' });
    if (!phone) return res.status(400).send({ err: 'phone is required' });
    if (!basic_info)
      return res.status(400).send({ err: 'basic_info is required' });
    if (!more_info)
      return res.status(400).send({ err: 'more_info is required' });

    if (
      !basic_info ||
      !basic_info.authentication ||
      !basic_info.contact_time ||
      !basic_info.payment
    )
      return res.status(400).send({ err: '모든 기본정보를 입력해주세요 !!' });

    if (
      !more_info ||
      !more_info.career ||
      !more_info.employees_num ||
      !more_info.business_registration ||
      !more_info.certificate
    )
      return res.status(400).send({ err: '모든 추가정보를 입력해 주세요 !!' });

    const master = new Master(req.body);
    await master.save();
    return res.send({ master });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

masterRouter.delete('/:masterId', async (req, res) => {
  try {
    const { masterId } = req.params;
    if (!mongoose.isValidObjectId(masterId))
      return res.status(400).send({ err: 'invalid masterId' });

    const master = await Master.findOneAndDelete({ _id: masterId });
    return res.send({ master });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

masterRouter.put('/:masterId', async (req, res) => {
  try {
    const { masterId } = req.params;

    // Debug
    // 1. MasterId 형식 점검
    if (!mongoose.isValidObjectId(masterId))
      return res.status(400).send({ err: 'invalid masterId' });

    const { username, gender, email, password, phone, basic_info, more_info } =
      req.body;
    // 2. age or name 이 존재하는지 점검
    if (!username) return res.status(400).send({ err: 'username is required' });
    if (!gender) return res.status(400).send({ err: 'gender is required' });
    if (!email) return res.status(400).send({ err: 'email is required' });
    if (!password) return res.status(400).send({ err: 'password is required' });
    if (!phone) return res.status(400).send({ err: 'phone is required' });
    if (!basic_info)
      return res.status(400).send({ err: 'basic_info is required' });
    if (!more_info)
      return res.status(400).send({ err: 'more_info is required' });

    if (
      !basic_info ||
      !basic_info.authentication ||
      !basic_info.contact_time ||
      !basic_info.payment
    )
      return res.status(400).send({ err: '모든 기본정보를 입력해주세요 !!' });

    if (
      !more_info ||
      !more_info.career ||
      !more_info.employees_num ||
      !more_info.business_registration ||
      !more_info.certificate
    )
      return res.status(400).send({ err: '모든 추가정보를 입력해 주세요 !!' });

    // 3. 형식 점검
    if (typeof basic_info.authentication !== 'boolean')
      return res.status(400).send({ err: 'authentication must be a boolean' });

    // 4. name.first and name.last가 존재하는지 그리고 type이 String인지 점검
    if (typeof more_info.business_registration !== 'boolean')
      return res
        .status(400)
        .send({ err: 'business_registration must be boolean' });

    // // 5. Update Data 생성 (mongodb에서 수정과 업데이트를 동시에 진행, 장점 속도빠름 ,단점:여러정도 바꿀때 불편)
    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;

    // // 6. 데이터 변경 시작
    // const user = await User.findByIdAndUpdate(
    //   // 1) 변경 대상 찾기
    //   userId,
    //   // 2) 변경 데이터 입력
    //   updateBody,
    //   // 3) 데이터를 변경후 변경된 정보를 가져오기 위해 new:true를 입력한다.
    //   { new: true }
    // );

    // 7. Update 데이터를 찾고 찾은 데이터를 바꾸는 로직. 데이터구조가 복잡할때
    let master = await Master.findById(masterId);
    console.log({ masterBeforeEdit: master });

    if (username) master.username = username;
    if (gender) master.gender = gender;
    if (email) master.email = email;
    if (password) master.password = password;
    if (phone) master.phone = phone;
    if (basic_info) master.basic_info = basic_info;
    if (more_info) master.more_info = more_info;

    console.log({ masterAfterEdit: master });

    await master.save();

    return res.send({ master });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { masterRouter };
