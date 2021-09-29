import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell"); 


async function run() {
    try {
        const inputString: string | undefined = tl.getInput("samplestring", true);
        const sourcesDirectory: string | undefined = tl.getInput("sourcesDirectory", true);

        const fs = require('fs');
        fs.readdir(sourcesDirectory, (err: any, files: any) => {
            files.forEach((file: any) => {
                console.log(file);
            });
        });
        const workingDirectory: string | undefined = tl.getInput("workingDirectory", true);
        const repositoryUrl: string | undefined = tl.getInput("repositoryUrl", true);
        const repositoryLocalPath: string | undefined = tl.getInput("repositoryLocalPath", true);
        const pipelineWorkspace: string | undefined = tl.getInput("pipelineWorkspace", true);
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

        ps.PythonShell.run(
            __dirname + "/test.py",
            {args: ["something"]},
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
