const validateAdmin = (req, res, next) => {
  const adminIds = JSON.parse(process.env.ADMIN);

  if (!adminIds.includes(req.user.id)) {
    res.status(403);
    throw new Error("Only admin can create new users!");
  }
  next();
};
module.exports = validateAdmin;
