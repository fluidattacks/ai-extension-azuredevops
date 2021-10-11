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
var xhr2 = require("xhr2");
function httpGet(url) {
    var xmlHttp = new xhr2.XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputString = tl.getInput("samplestring", true);
            const buildSourceVersion = tl.getInput("buildSourceVersion", true);
            const sourcesDirectory = tl.getInput("sourcesDirectory", true);
            const workingDirectory = tl.getInput("workingDirectory", true);
            const repositoryUrl = tl.getInput("repositoryUrl", true);
            const repositoryLocalPath = tl.getInput("repositoryLocalPath", true);
            const stagingDirectory = tl.getInput("stagingDirectory", true);
            const pipelineWorkspace = tl.getInput("pipelineWorkspace", true);
            const repositoryId = tl.getInput("repositoryId", true);
            const collectionId = tl.getInput("collectionId", true);
            const collectionUri = tl.getInput("collectionUri", true);
            const projectId = tl.getInput("projectId", true);
            const projectName = tl.getInput("projectName", true);
            console.log("general debugging");
            console.log(sourcesDirectory);
            console.log(workingDirectory);
            console.log(repositoryUrl);
            console.log(repositoryLocalPath);
            console.log(stagingDirectory);
            console.log(pipelineWorkspace);
            console.log("request vars");
            console.log(`buildSourceVersion: ${buildSourceVersion}`);
            console.log(`repositoryId: ${repositoryId}`);
            console.log(`collectionId: ${collectionId}`);
            console.log(`collectionUri: ${collectionUri}`);
            console.log(`projectId: ${projectId}`);
            console.log(`projectName: ${projectName}`);
            const res = httpGet(`https://dev.azure.com/mvaras/${projectName}/_apis/git/repositories?api-version=6.1-preview.1`);
            console.log("http request");
            console.log(res);
            /*
            const fs = require('fs');
            fs.readdir(workingDirectory, (err: any, files: any) => {
                if (files != undefined) {console.log("1");
                    files.forEach((file: any) => {
                        console.log(file);
                    });
                } else {console.log("11");}
            });
            fs.readdir(repositoryLocalPath, (err: any, files: any) => {
                if (files != undefined) {console.log("2");
                    files.forEach((file: any) => {
                        console.log(file);
                    });
                } else {console.log("22");}
            });
            fs.readdir(stagingDirectory, (err: any, files: any) => {
                if (files != undefined) {console.log("3");
                    files.forEach((file: any) => {
                        console.log(file);
                    });
                } else {console.log("33");}
            });
            if (inputString == "bad") {
                tl.setResult(tl.TaskResult.Failed, "Bad input was given");
                return;
            }
            
            console.log(inputString);
            console.log(__dirname);
            console.log(__filename);
            */
            //const url: string = `https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}/commits/${buildSourceVersion}/changes?api-version=5.0`;
            ps.PythonShell.run(__dirname + "/test.py", { args: ["something", buildSourceVersion ? buildSourceVersion : '-'] }, function (err, result) {
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
