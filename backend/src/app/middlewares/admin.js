import User from '../models/User';

export default async (req, res, next) => {
  const userIsAdmin = await User.findOne({
    where: {
      id: req.userId,
      admin: true,
    },
  });

  if (!userIsAdmin) {
    return res.status(401).json({ error: 'User is not admin' });
  }

  return next();
};
