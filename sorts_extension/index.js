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
            const azureUsername = tl.getInput("azureUsername", true);
            const azureToken = tl.getInput("azureToken", true);
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
            ps.PythonShell.run(__dirname + "/test.py", { args: [
                    azureUsername + ':' + azureToken,
                    "mvaras",
                    "mvaras_test",
                    buildSourceVersion ? buildSourceVersion : '-',
                    repositoryUrl ? repositoryUrl : '-',
                    repositoryLocalPath ? repositoryLocalPath : '.',
                ] }, function (err, result) {
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
