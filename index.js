import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { format } from 'date-fns'
import path from 'path'


const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
app.use(express.json())

//Endpoint to view the content of a specific file(middleware)
app.use('/viewFile',express.static('TimeStamp'))



//Endpoint to create text file in a particular folder
app.get('/create',(req,res) => {
    try {
        let today = format(new Date(),'dd-MM-yyyy-HH-mm-ss')

        const filePath = `TimeStamp/${today}.txt`

        fs.writeFileSync(filePath,`${today}`,'utf8')

        let data=fs.readFileSync(filePath,'utf8')

        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
})



//Endpoint to retrieve all text files
app.get("/getTextFiles", (req, res) => {
    try {
        const folderPath = "TimeStamp"
  
        fs.readdir(folderPath, (error, files) => {   //Returns an array
            if (error) {
                res.status(500).send({
                message: error.message || "An error occured"
                })
                
            } else {
                const textFiles = files.filter((file) => path.extname(file) === ".txt")

                res.status(200).send(textFiles);
            }
        })
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
  })

  app.get('*',(req,res) => {
    res.status(400).send('Incorrect path')
  })


app.listen(PORT,() => console.log(`App is Listening to Port ${PORT}`))