const { Router } = require('express');
const userRouter = Router();
const { User } = require('../models');
const mongoose = require('mongoose');

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'invalid userId' });
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post('/', async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username) return res.status(400).send({ err: 'username is required' });
    if (!email) return res.status(400).send({ err: 'email is required' });
    if (!password) return res.status(400).send({ err: 'password is required' });

    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'invalid userId' });

    const user = await User.findOneAndDelete({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Debug
    // 1. UserId 형식 점검
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'invalid userId' });

    let { username, email, password } = req.body;
    // 2. Check username , email , password
    if (!username) return res.status(400).send({ err: 'username is required' });
    if (!email) return res.status(400).send({ err: 'email is required' });
    if (!password) return res.status(400).send({ err: 'password is required' });

    // 3.Type 점검
    if (typeof username !== 'string')
      return res.status(400).send({ err: 'username must be a string' });
    if (typeof email !== 'string')
      return res.status(400).send({ err: 'email must be a string' });
    if (typeof password !== 'string')
      return res.status(400).send({ err: 'password must be a string' });

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
    let user = await User.findById(userId);
    console.log({ userBeforeEdit: user });

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    console.log({ userAfterEdit: user });

    await user.save();

    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { userRouter };
