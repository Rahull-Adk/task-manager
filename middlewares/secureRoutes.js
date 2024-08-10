import jwt from "jsonwebtoken";

export const secureRoutes = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) return res.status(401).json({message: "Invalid Token"});

        req.user = decodedToken;
        next();
    } catch(error) {
        console.log(`Error in secureRoute middleware: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}