import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell"); 


async function run() {
    try {
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

        ps.PythonShell.run(
            __dirname + "/sorts/entrypoint.py",
            {args: [
                azureUsername + ':' + azureToken,
                "mvaras",
                "mvaras_test",
                buildSourceVersion ? buildSourceVersion : '-',
                repositoryLocalPath ? repositoryLocalPath : '.',
            ]},
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
