const validateAdmin = (req, res, next) => {
  const adminIds = JSON.parse(process.env.ADMIN);

  if (!adminIds.includes(req.user.id)) {
    return res.status(403).send("Access forbidden");
  } else {
    next();
  }
};
module.exports = validateAdmin;
