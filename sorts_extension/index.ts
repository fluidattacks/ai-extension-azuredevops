import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell");


async function run() {
    try {
        const azureUsername: string | undefined = tl.getInput("azureUsername", true);
        const azureToken: string | undefined = tl.getInput("azureToken", true);
        const buildSourceVersion: string | undefined = tl.getInput("buildSourceVersion", true);
        const repositoryLocalPath: string | undefined = tl.getInput("repositoryLocalPath", true);
        const repositoryId: string | undefined = tl.getInput("repositoryId", true);
        const collectionUri: string | undefined = tl.getInput("collectionUri", true);
        const projectName: string | undefined = tl.getInput("projectName", true);
        const breakPipeline: string | undefined = tl.getInput("breakPipeline", false);
        const commitRiskLimit: string | undefined = tl.getInput("commitRiskLimit", false);
        // console.log("request vars");
        // console.log(`repositoryLocalPath: ${repositoryLocalPath}`);
        // console.log(`buildSourceVersion: ${buildSourceVersion}`);
        // console.log(`repositoryId: ${repositoryId}`);
        // console.log(`collectionUri: ${collectionUri}`);
        // console.log(`projectName: ${projectName}`);

        const collectionUriSplit: string[] | undefined = String(collectionUri).split("/");
        const organizationName: string | undefined = collectionUriSplit[collectionUriSplit.length - 2];

        ps.PythonShell.run(
            __dirname + "/sorts/entrypoint.py",
            {
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
            },
            function(err, result) {
                if (err || result == undefined) {
                    throw err;
                }
                result.forEach((item) => console.log(item));
            }
        );
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
