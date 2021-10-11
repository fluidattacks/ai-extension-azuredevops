import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell"); 
var xhr2 = require("xhr2");


function httpGet(url: string) {
    var xmlHttp = new xhr2.XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

async function run() {
    try {
        const inputString: string | undefined = tl.getInput("samplestring", true);
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

        const res = httpGet(`https://dev.azure.com/mvaras/${projectName}/_apis/git/repositories?api-version=6.1-preview.1`)
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

        ps.PythonShell.run(
            __dirname + "/test.py",
            {args: ["something", buildSourceVersion ? buildSourceVersion : '-']},
            function(err, result) {
                if (err) throw err;
                console.log(result);
            }
        );
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
