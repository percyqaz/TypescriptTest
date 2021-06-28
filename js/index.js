"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
app.use(express_1.default.urlencoded());
app.listen(8080, function () { console.log("Server is listening"); });
if (!fs_1.default.existsSync("./file.txt")) {
    fs_1.default.writeFileSync("./file.txt", "3343\n2222");
}
var lines = fs_1.default.readFileSync("./file.txt", "utf-8").split("\n");
var logger = function (req, res, next) {
    var content = req.method === "GET" ? req.query : req.body;
    console.log("Received " + req.method + " request at " + req.originalUrl + " with body " + JSON.stringify(content));
    console.log("Current state of the file:\n" + lines.join("\n"));
    next();
};
app.use(logger);
var middleware = function (req, res, next) {
    var content = req.method === "GET" ? req.query : req.body;
    if (typeof content.line !== "string") {
        res.status(400).send("Give a line number.");
    }
    else {
        var lineNum = Number(content.line);
        if (Number.isNaN(lineNum) || !Number.isSafeInteger(lineNum)) {
            res.status(400).send("Give a valid line number.");
        }
        else if (lineNum < 0 || lineNum >= lines.length) {
            res.status(404).send("Line does not exist!");
        }
        else {
            res.locals.lineNum = lineNum;
            next();
        }
    }
};
// top level get
app.get("/", middleware, function (req, res) {
    res.send(lines[res.locals.lineNum]);
});
// add lines via post request
app.post("/append", function (req, res) {
    if (typeof req.body === "object" && req.body) {
        if (typeof req.body.text !== "string") {
            res.status(400).send("Invalid line.");
        }
        else {
            var cleanLine = req.body.text.replace("/\n/g", "");
            lines.push(req.body.text);
            fs_1.default.writeFileSync("./file.txt", lines.join("\n"));
            res.send("OK");
        }
    }
    else {
        res.status(400).send("Give a line.");
    }
});
// add lines via post request
app.post("/delete", middleware, function (req, res) {
    lines.splice(res.locals.lineNum, 1);
    fs_1.default.writeFileSync("./file.txt", lines.join("\n"));
    res.send("OK");
});
