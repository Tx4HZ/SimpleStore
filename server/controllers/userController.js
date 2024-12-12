import ApiError from "../error/ApiError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User, Basket } from "../models/models.js"


const generateJWT = (id, email, role) => {
  return jwt.sign({id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
	async registration(req, res, next) {
    const {email, password, role} = req.body
    if (!email || !password) {
      return next(ApiError.badRequest("Wrong password or email"))
    }
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      return next(ApiError.badRequest("Email is used!"))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, role, password: hashPassword})
    const basket = await Basket.create({userId: user.id})
    const token = generateJWT(user.id, user.email, user.role)
    return res.json(token)
  }

	async login(req, res, next) {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if(!user) {
      return next(ApiError.forbidden("Wrong email or password"))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.forbidden("Wrong email or password"))
    }
    const token = generateJWT(user.id, user.email, user.role)
    return res.json(token)
  }

	async check(req, res, next) {
    const token = generateJWT(req.user.id, req.user.email, req.user.role)
    return res.json({token})
  }
}

export default new UserController()