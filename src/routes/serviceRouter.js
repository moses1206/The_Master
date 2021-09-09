const { Router } = require('express');
const serviceRouter = Router();
const { Service, Master } = require('../models');
const { isValidObjectId } = require('mongoose');
const mongoose = require('mongoose');

// serviceRouter.use('/:blogId/comment', commentRouter);

serviceRouter.post('/', async (req, res) => {
  try {
    const {
      sv_category,
      sv_name,
      sv_detail,
      sv_address,
      sv_short_introdution,
      masterId,
    } = req.body;

    if (typeof sv_category !== 'string')
      res.status(400).send({ err: 'sv_category is required' });

    if (typeof sv_name !== 'string')
      res.status(400).send({ err: 'sv_name is required' });

    if (typeof sv_detail !== 'string')
      res.status(400).send({ err: 'sv_detail is required' });

    if (typeof sv_address !== 'string')
      res.status(400).send({ err: 'sv_address is required' });

    if (typeof sv_short_introdution !== 'string')
      res.status(400).send({ err: 'sv_short_introdution is required' });

    if (typeof masterId !== 'string')
      res.status(400).send({ err: 'masterId is required' });

    if (!isValidObjectId(masterId))
      res.status(400).send({ err: 'User ID is invalid' });

    let master = await Master.findById(masterId);
    if (!master)
      res.status(400).send({ err: '마스터가 존재하지 않습니다. !!' });

    if (sv_category === '레슨' && sv_name === '영어') {
      level = 1;
      order = 1;
    }

    if (sv_category === '레슨' && sv_name === '수학') {
      level = 1;
      order = 2;
    }

    if (sv_category === '레슨' && sv_name === '과학') {
      level = 1;
      order = 3;
    }

    if (sv_category === '레슨' && sv_name === '리액트') {
      level = 1;
      order = 4;
    }

    if (sv_category === '홈/리빙' && sv_name === '집') {
      level = 2;
      order = 1;
    }

    if (sv_category === '홈/리빙' && sv_name === '상업공간') {
      level = 2;
      order = 2;
    }

    if (sv_category === '홈/리빙' && sv_name === '욕실') {
      level = 2;
      order = 3;
    }

    // user를 가져온 풀데이터로 교체
    let service = new Service({
      ...req.body,
      master: master,
      sv_level: level,
      sv_order: order,
    });
    await service.save();

    return res.send({ service });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

serviceRouter.get('/', async (req, res) => {
  try {
    const services = await Service.find({}).limit(10);
    return res.send({ services });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

serviceRouter.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!isValidObjectId(serviceId))
      res.status(400).send({ err: 'Service ID is invalid' });

    const service = await Service.findOne({ _id: serviceId });
    return res.send({ service });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 블로그 게시글 전체수정
serviceRouter.put('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!isValidObjectId(serviceId))
      res.status(400).send({ err: 'Service ID is invalid' });

    const {
      sv_category,
      sv_name,
      sv_detail,
      sv_address,
      sv_short_introdution,
    } = req.body;

    if (typeof sv_category !== 'string')
      res.status(400).send({ err: 'sv_category is required' });

    if (typeof sv_name !== 'string')
      res.status(400).send({ err: 'sv_name is required' });

    if (typeof sv_detail !== 'string')
      res.status(400).send({ err: 'sv_detail is required' });

    if (typeof sv_address !== 'string')
      res.status(400).send({ err: 'sv_address is required' });

    if (typeof sv_short_introdution !== 'string')
      res.status(400).send({ err: 'sv_short_introdution is required' });

    const service = await Service.findByIdAndUpdate(
      { _id: serviceId },
      { sv_category, sv_name, sv_detail, sv_address, sv_short_introdution },
      //   바뀐결과값 리턴
      { new: true }
    );

    return res.send({ service });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// sv_detail 부분수정
serviceRouter.patch('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { sv_detail } = req.body;

    if (!isValidObjectId(serviceId))
      res.status(400).send({ err: 'serviceId is invalid' });

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { sv_detail },
      { new: true }
    );
    res.send({ service });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

serviceRouter.delete('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!mongoose.isValidObjectId(serviceId))
      return res.status(400).send({ err: 'invalid serviceId' });

    const service = await Service.findOneAndDelete({ _id: serviceId });
    return res.send({ service });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { serviceRouter };
