const router = require("express").Router();
const userRoutes = require("./user-routes");
const PostRoutes = require("./Post-routes");

router.use("/users", userRoutes);
router.use("/Posts", PostRoutes);

module.exports = router;