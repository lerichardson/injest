import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import _ from "lodash";
import client from "./src/db.js";
const { useID } = require("@dothq/id");
const compression = require('compression')

const app = express();
const limiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 60 // 60 requests per minute
});
// Server settings
app.set("port", process.env.PORT || 3000);
app.set('trust proxy', 1);
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(fileUpload({
    createParentPath: true
}));
app.use(compression());
// !! change to morgan("combined") for production !!
app.use(morgan('dev'));
app.use(cors());
// Database connection
client.on("ready", () => {
    console.log("DB connection: successful");
});
client.on('error', (err: string) => {
    console.log('Error ' + err);
});
app.get("/", (req: express.Request, res: express.Response) => {
    res.send(`
    <h2>With Node.js <code>"http"</code> module</h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>File: <input type="file" name="fileItem" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
    `);
});
app.get('/item/:iid/', (req: express.Request, res: express.Response) => {
    res.sendFile(req.params.iid, { root: __dirname + "/uploads" });
});
app.post('/upload', async (req: express.Request, res: express.Response) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let fileUpload: any = req.files.fileItem;
            let fileName: string = useID() + fileUpload.name;
            fileUpload.mv('./uploads/' + fileName);
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: fileName,
                    mimetype: fileUpload.mimetype,
                    size: fileUpload.size
                }
            });
        }
    } catch (err: any) {
        res.status(500).send(err);
        console.log(err);
    }
});
app.listen(3000, () => {
    console.log("Dev server started on port 3000, access at http://localhost:3000");
});