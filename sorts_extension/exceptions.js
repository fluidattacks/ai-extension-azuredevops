"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsError = void 0;
class CredentialsError extends Error {
    constructor() {
        super(`
            You need to set up your Azure credentials (username + token) in your pipeline .yaml.
            Please refer to https://github.com/fluidattacks/ai-extension-azuredevops#configuring-the-pipeline
        `);
        this.name = "CredentialsError";
    }
}
exports.CredentialsError = CredentialsError;
