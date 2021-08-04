import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import formidable from "formidable";
import rateLimit from "express-rate-limit";
import client from "./src/db.js";

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
app.use(cors());
// Database connection
client.on("ready", () => {
    console.log("DB connection: successful");
});
client.on('error', err => {
    console.log('Error ' + err);
});
app.get('/item/:iid/', (req: express.Request, res: express.Response) => { 
    res.send(req.params);
});
app.post('/upload', (req: express.Request, res: express.Response) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        res.send(files);
    });
});
app.listen(3000, () => {
    console.log("Dev server started on port 3000, access at http://localhost:3000");
});