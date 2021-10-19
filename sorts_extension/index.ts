import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell"); 
var xhr2 = require("xhr2");


function httpGet(url: string) {
    var xmlHttp = new xhr2.XMLHttpRequest();
    xmlHttp.addEventListener("load", function() {
        const initialArray = JSON.parse(xmlHttp.response);
        console.log(initialArray);
    }, false);
    xmlHttp.open("GET", url, false);
    xmlHttp.send();
    /*
    xmlHttp.onload = function (e: any) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                console.log(xmlHttp.responseText);
            } else {
                console.error(xmlHttp.statusText);
            }
        }
    };
    xmlHttp.onerror = function (e: any) {
        console.error(xmlHttp.statusText);
        console.error(e);
    };
    xmlHttp.send(null);
    */
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

        ps.PythonShell.run(
            __dirname + "/test.py",
            {args: ["mvaras", "mvaras_test", buildSourceVersion ? buildSourceVersion : '-']},
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
