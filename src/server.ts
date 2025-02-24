import express, { Request, Response } from 'express'
import { connectSQL } from './sql/connectsql'
import { Client } from 'pg'
import categoryRouter from './routes/categoryRouter'
import productRouter from "./routes/productRouter"

const app = express()
const port = 3050

app.use(express.json())

app.use("/categories", categoryRouter)

app.use("/products", productRouter)

app.get("/", (req : Request, resp : Response) => {
    resp.send("Products & Categories. Main Page")
})

connectSQL().then (() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    })
}).catch((err : any) => {
    console.log(`SQL connection error: ${err.toString()}`)
    

    process.exit(1)
})

// close app gracefully
process.on('SIGINT', async () => {
    /*
    const sqlClient : Client = app.locals.sqlClient

    await sqlClient.close()
    console.log('SQL client close successfully')

    */

    process.exit(0)
})

export default app