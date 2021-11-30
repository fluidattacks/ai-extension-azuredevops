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
            const repositoryLocalPath = tl.getInput("repositoryLocalPath", true);
            const repositoryId = tl.getInput("repositoryId", true);
            const collectionUri = tl.getInput("collectionUri", true);
            const projectName = tl.getInput("projectName", true);
            const breakPipeline = tl.getInput("breakPipeline", false);
            const commitRiskLimit = tl.getInput("commitRiskLimit", false);
            // console.log("request vars");
            // console.log(`repositoryLocalPath: ${repositoryLocalPath}`);
            // console.log(`buildSourceVersion: ${buildSourceVersion}`);
            // console.log(`repositoryId: ${repositoryId}`);
            // console.log(`collectionUri: ${collectionUri}`);
            // console.log(`projectName: ${projectName}`);
            const collectionUriSplit = String(collectionUri).split("/");
            const organizationName = collectionUriSplit[collectionUriSplit.length - 2];
            ps.PythonShell.run(__dirname + "/sorts/entrypoint.py", {
                args: [
                    azureUsername + ':' + azureToken,
                    organizationName ? organizationName : '-',
                    projectName ? projectName : '-',
                    repositoryId ? repositoryId : '-',
                    buildSourceVersion ? buildSourceVersion : '-',
                    repositoryLocalPath ? repositoryLocalPath : '.',
                    breakPipeline ? breakPipeline : "",
                    commitRiskLimit ? commitRiskLimit : "75"
                ]
            }, function (err, result) {
                if (err || result == undefined) {
                    throw err;
                }
                result.forEach((item) => console.log(item));
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
