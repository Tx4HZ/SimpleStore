import { v4 } from "uuid"
import path from "node:path"
import { Device, DeviceInfo } from "../models/models.js"
import ApiError from "../error/ApiError.js"
class DeviceController {
	async create(req, res, next) {
    try {
		let { name, price, brandId, typeId, info } = req.body
		const { img } = req.files
		let fileName = v4() + ".jpg"
		img.mv(path.resolve("./static", fileName))

		const device = await Device.create({
			name,
			price,
			brandId,
			typeId,
			img: fileName,
		})

		if (info) {
			info = JSON.parse(info)
			info.forEach(i => {
				DeviceInfo.create({
					title: i.title,
					description: i.description,
					deviceId: device.id
				})
			});
		}

		
		return res.json(device)
    } catch(e) {
      next(ApiError.badRequest(e.message))
    }
	}

	async getAll(req, res) {
    let {brandId, typeId, limit, page} = req.query
		page = page || 1
		limit = limit || 3
		let offset = page * limit - limit
		let device;
		if(!brandId && !typeId) {
			// выводим все девайсы
			device = await Device.findAndCountAll({limit, offset})
		}
		if(brandId && !typeId) {
			// выводим по брендам
			device = await Device.findAndCountAll({
				where: { brandId },
				limit,
				offset,
			})
		} 
		if (!brandId && typeId) {
			// выводим по типам
			device = await Device.findAndCountAll({
				where: { typeId },
				limit,
				offset,
			})
		}
		if (brandId && typeId) {
			// выводим и по тимам и по брендам
			device = await Device.findAndCountAll({
				where: { brandId, typeId },
				limit,
				offset,
			})
		}
		console.log(brandId, typeId)
		return res.json(device)
  }

	async getOne(req, res) {
		const {id} = req.params
		const device = await Device.findOne({where: {id}, include: [{model: DeviceInfo, as: 'info'}]})
		return res.json(device)
	}
}

export default new DeviceController()
