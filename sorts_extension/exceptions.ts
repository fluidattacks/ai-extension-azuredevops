export class CredentialsError extends Error {
    constructor() {
        super(`
            You need to set up your Azure credentials (username + token) in your pipeline .yaml.
            Please refer to https://github.com/fluidattacks/ai-extension-azuredevops#configuring-the-pipeline
        `);
        this.name = "CredentialsError";
    }
}
