import ps = require("python-shell"); 
import tl = require("azure-pipelines-task-lib/task");


async function run() {
    try {
        const inputString: string | undefined = tl.getInput("samplestring", true);
        /*
        if (inputString == "bad") {
            tl.setResult(tl.TaskResult.Failed, "Bad input was given");
            return;
        }
        console.log("Hello", inputString);
        */
        console.log(inputString);
        console.log(__dirname);
        console.log(__filename);
        ps.PythonShell.run(
            "test.py",
            {args: ["to_print"]},
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
