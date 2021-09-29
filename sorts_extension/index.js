"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const ps = require("python-shell");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputString = tl.getInput("samplestring", true);
            const sourcesDirectory = tl.getInput("sourcesDirectory", true);
            const fs = require('fs');
            fs.readdir(sourcesDirectory, (err, files) => {
                files.forEach((file) => {
                    console.log(file);
                });
            });
            const workingDirectory = tl.getInput("workingDirectory", true);
            const repositoryUrl = tl.getInput("repositoryUrl", true);
            const repositoryLocalPath = tl.getInput("repositoryLocalPath", true);
            const pipelineWorkspace = tl.getInput("pipelineWorkspace", true);
            /*
            if (inputString == "bad") {
                tl.setResult(tl.TaskResult.Failed, "Bad input was given");
                return;
            }
            console.log("Hello", inputString);
            */
            console.log(sourcesDirectory);
            console.log(workingDirectory);
            console.log(repositoryUrl);
            console.log(repositoryLocalPath);
            console.log(pipelineWorkspace);
            console.log(inputString);
            console.log(__dirname);
            console.log(__filename);
            ps.PythonShell.run(__dirname + "/test.py", { args: ["something"] }, function (err, result) {
                if (err)
                    throw err;
                console.log(result);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
