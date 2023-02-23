const router = require("express").Router();
const {
  //tested
  getAllUser,
  //tested
  getUserById,
  //tested
  createUser,
  //tested
  updateUser,
  //tested
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");

// /api/users
router
.route("/")
.get(getAllUser)
.post(createUser);

// /api/users/:id
router
.route("/:id")
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId")
.post(addFriend)
.delete(removeFriend);

module.exports = router;