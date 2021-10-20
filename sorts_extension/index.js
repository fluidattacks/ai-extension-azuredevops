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
            ps.PythonShell.run(__dirname + "/test.py", { args: [
                    "mvaras" + ':' + "z4grp7xjypzkpl34r2eaeiu773aw5qath2q4rgoksxdudoppstda",
                    "mvaras",
                    "mvaras_test",
                    "x",
                    "x",
                    "x",
                ] }, function (err, result) {
                if (err)
                    throw err;
                console.log(result);
            }); /*
            const azureUsername: string | undefined = tl.getInput("azureUsername", true);
            const azureToken: string | undefined = tl.getInput("azureToken", true);
            const buildSourceVersion: string | undefined = tl.getInput("buildSourceVersion", true);
            const sourcesDirectory: string | undefined = tl.getInput("sourcesDirectory", true);
            const workingDirectory: string | undefined = tl.getInput("workingDirectory", true);
            const repositoryUrl: string | undefined = tl.getInput("repositoryUrl", true);
            const repositoryLocalPath: string | undefined = tl.getInput("repositoryLocalPath", true);
            const stagingDirectory: string | undefined = tl.getInput("stagingDirectory", true);
            const pipelineWorkspace: string | undefined = tl.getInput("pipelineWorkspace", true);
            const repositoryId: string | undefined = tl.getInput("repositoryId", true);
            const collectionId: string | undefined = tl.getInput("collectionId", true);
            const collectionUri: string | undefined = tl.getInput("collectionUri", true);
            const projectId: string | undefined = tl.getInput("projectId", true);
            const projectName: string | undefined = tl.getInput("projectName", true);
    
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
    */
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
