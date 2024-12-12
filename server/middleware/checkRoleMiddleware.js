import jwt from "jsonwebtoken"

const checkRole = function(role) {
  return (req, res, next) => {
		if (req.method === "OPTIONS") {
			next()
		}
		try {
			const token = req.headers.authorization.split(" ")[1] // Bearer
			if (!token) {
				return res.status(401).json({ message: "No auth" })
			}
			const decoded = jwt.verify(token, process.env.SECRET_KEY)
      if(decoded.role !== role) {
        return res.status(403).json({message: "No permission"})
      }
			req.user = decoded
			next()
		} catch (e) {
			res.status(401).json({ message: "No auth" })
		}
	}
}

export default checkRole