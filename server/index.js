import express from "express"
import sequelize from "./db.js"
import * as models from "./models/models.js"
import fileUpload from "express-fileupload"
import cors from "cors"
import router from "./routers/index.js"
import errorHandler from "./middleware/ErrorHandlingMiddleware.js"
import path from "node:path"

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve('./static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Hello world!"
  })
})

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, () => console.log("Server running on: " + PORT))
	} catch (e) {
		console.log(e)
	}
}

start()
