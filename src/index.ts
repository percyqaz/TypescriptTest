import express, { RequestHandler } from "express";
import fs from "fs";

const app = express();

app.use(express.urlencoded());

app.listen(8080, () => { console.log("Server is listening") });

if (!fs.existsSync("./file.txt")) { fs.writeFileSync("./file.txt", "3343\n2222") }

let lines = fs.readFileSync("./file.txt", "utf-8").split("\n");

const logger : RequestHandler = (req, res, next) => {
    let content = req.method === "GET" ? req.query : req.body
    console.log(`Received ${req.method} request at ${req.originalUrl} with body ${JSON.stringify(content)}`);
    console.log("Current state of the file:\n" + lines.join("\n"));
    next();
}

app.use(logger)

const middleware : RequestHandler = (req, res, next) => {
    let content = req.method === "GET" ? req.query : req.body

    if (typeof content.line !== "string") { res.status(400).send("Give a line number.") }
    else {
        const lineNum = Number(content.line);

        if (Number.isNaN(lineNum) || !Number.isSafeInteger(lineNum)) {
            res.status(400).send("Give a valid line number.");
        }
        else if (lineNum < 0 || lineNum >= lines.length) {
            res.status(404).send("Line does not exist!");
        }
        else {
            res.locals.lineNum = lineNum
            next();
        }
    }
}

// top level get

app.get("/", middleware, (req, res) => {
    res.send(lines[res.locals.lineNum]);
})

// add lines via post request

app.post("/append", (req, res) => {
    if (typeof req.body === "object" && req.body) {
        if (typeof req.body.text !== "string") {
            res.status(400).send("Invalid line.");
        }
        else {
            const cleanLine = req.body.text.replace("/\n/g", "")
            lines.push(req.body.text);
            fs.writeFileSync("./file.txt", lines.join("\n"));

            res.send("OK");
        }
    }
    else {
        res.status(400).send("Give a line.")
    }
})

// add lines via post request

app.post("/delete", middleware, (req, res) => {
    lines.splice(res.locals.lineNum, 1);
    fs.writeFileSync("./file.txt", lines.join("\n"));
    res.send("OK");
})