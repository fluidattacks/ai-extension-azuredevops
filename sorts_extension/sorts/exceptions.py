class CredentialsError(Exception):
    def __init__(self) -> None:
        msg = (
            "There has been an error with your Azure credentials (username + token). They might not be correct. "
            "Please refer to https://github.com/fluidattacks/ai-extension-azuredevops#configuring-the-pipeline"
        )
        super(CredentialsError, self).__init__(msg)
