import tl = require("azure-pipelines-task-lib/task");
import ps = require("python-shell"); 


async function run() {
    try {
        const inputString: string | undefined = tl.getInput("samplestring", true);
        const buildSourceVersion: string | undefined = tl.getInput("buildSourceVersion", true);
        const sourcesDirectory: string | undefined = tl.getInput("sourcesDirectory", true);
        const workingDirectory: string | undefined = tl.getInput("workingDirectory", true);
        const repositoryUrl: string | undefined = tl.getInput("repositoryUrl", true);
        const repositoryLocalPath: string | undefined = tl.getInput("repositoryLocalPath", true);
        const stagingDirectory: string | undefined = tl.getInput("Build.StagingDirectory", true);
        const pipelineWorkspace: string | undefined = tl.getInput("pipelineWorkspace", true);
        console.log(buildSourceVersion);
        console.log(sourcesDirectory);
        console.log(workingDirectory);
        console.log(repositoryUrl);
        console.log(repositoryLocalPath);
        console.log(stagingDirectory);
        console.log(pipelineWorkspace);
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
        /*
        if (inputString == "bad") {
            tl.setResult(tl.TaskResult.Failed, "Bad input was given");
            return;
        }
        */
        
        console.log(inputString);
        console.log(__dirname);
        console.log(__filename);

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
