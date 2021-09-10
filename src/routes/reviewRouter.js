const { Router } = require('express');
const reviewRouter = Router({ mergeParams: true });
const { Review, Service, User } = require('../models');
const { isValidObjectId } = require('mongoose');
const { protect } = require('../middleware/auth');

// blog/:blogId/comment/:commentId
// Router({mergeParams:true}) =>중간에 blogId를 가져올수 있다.

reviewRouter.post('/', protect, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { content, userId } = req.body;

    console.log(serviceId);
    if (!isValidObjectId(serviceId))
      return res.status(400).send({ err: 'serviceId is invalid' });

    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'userId is invalid' });

    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' });

    //   Promise.all 을 통해 NonBlocking 구현!!
    const [service, user] = await Promise.all([
      Service.findByIdAndUpdate(serviceId),
      User.findByIdAndUpdate(userId),
    ]);

    if (!service || !user)
      return res.status(400).send({ err: 'Service or User dose not exist' });

    const review = new Review({ content, user, service });

    await review.save();

    return res.send({ review });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

reviewRouter.get('/', protect, async (req, res) => {
  const { serviceId } = req.params;

  if (!isValidObjectId(serviceId))
    return res.status(400).send({ err: 'serviceId is invalid' });

  const reviews = await Review.find({ service: serviceId });
  return res.send({ reviews });
});

module.exports = { reviewRouter };
