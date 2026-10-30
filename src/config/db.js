import mongoose from "mongoose";

export const startDB = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("Conexión a la base de datos establecida")
    } catch (error) {
        console.error("No se ha podido conectar a la base de datos", error)
    }
}