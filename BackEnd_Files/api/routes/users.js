const express = require("express");
const router = express.Router();

const {
	getAllUsers,
	getOneUser,
	deleteUser,
	updateUser,
	getUsersByRadius,
} = require("../controllers/users");

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         email:
 *           type: string
 *           description: The book title
 *         password:
 *           type: string
 *           description: The book author
 *         token:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The books managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: Object
 *               items:
 *                 $ref: '#/components/schemas/users'
 */
router.get("/", getAllUsers); //get all users (/users/)
router.get("/:userid", getOneUser); //get user by userid (/users/:appid)
router.delete("/:userid", deleteUser); //delete user (/users/:appid)
router.put("/:userid", updateUser);

router.get("/locations/:radius", getUsersByRadius);

module.exports = router;
