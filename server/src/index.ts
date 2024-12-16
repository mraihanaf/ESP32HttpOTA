import express, { NextFunction, Request, Response } from "express";
import { join } from "path"
import { sync } from "md5-file"

const app = express()

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
} )

app.get("/update", (req: Request, res: Response) => {
    console.log(req.headers)
    const filePath = join(__dirname, "../../esp32-firmware/.pio/build/esp32dev/firmware.bin")
    const options = {
        headers: {
            "x-MD5": sync(filePath)
        }
    }
    let isSame = false
    if( JSON.stringify(req.headers).includes(sync(filePath)) ){
        console.log("same")
        isSame = true
    }

    isSame ? res.sendStatus(304) : res.sendFile(filePath,  (err) => {
        if(err) {
            console.error(err)
        } else {
            console.log(`sent : ${filePath}`)
        }
    })
})

app.listen(8080, () => {
    console.log("app listening on port 8080")
})