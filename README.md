# Fluid Attacks AI

[Fluid Attacks](https://fluidattacks.com) AI
helps you detecting the files in your repository
that are more likely to contain security vulnerabilities,
enabling you to prioritize their review.

This repository contains an Azure DevOps extension
so you can use Fluid Attacks AI in your Azure projects.

## Getting started

### Requirements

1. An Azure account
1. An Azure organization and project
1. An Azure agent with:
    - Enough [parallel jobs](https://docs.microsoft.com/en-us/azure/devops/pipelines/licensing/concurrent-jobs?view=azure-devops&tabs=ms-hosted)
      as to be able to run a pipeline in your project
    - The following dependencies:
      - python3
      - python3-pip
      - python3-setuptools
1. Sufficient permissions to:
    - Install extensions from the
      [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
    - Create Azure pipelines
      in the project
1. An active session (just login to your account)

### Install the extension

Please visit
[Fluid Attacks AI at the Marketplace](https://marketplace.visualstudio.com/items?itemName=FluidAttacks.ai)
and install it in your Azure organization
by clicking on the **Get it free** button.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/get-it-free-at-the-marketplace.png)

### Setup Azure Pipelines in your project

> This step is optional
> if your project has already configured Azure Pipelines

In your project,
navigate to the pipelines section
and click in the **Create Pipeline** button.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/create-pipeline-view.png)

Now follow the wizard.
Our code is located at **Azure Repos Git**:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/create-pipeline-view-connect.png)

Select the repository:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/create-pipeline-view-select-repo.png)

Finally click on **Save**.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/create-pipeline-view-review-and-save.png)

At the end of this process we would have our first Azure Pipeline:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/create-pipeline-view-finished.png)

### Configuring the pipeline

The last step will be
to customize your [azure-pipelines.yml] file.

In order to do this go to the Pipelines view of your project
and click **edit** in edit pipeline:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/edit-pipeline.png)

And then copy paste the following content.
Please make sure to do the modifications explained in the code-comments:

```yaml
trigger:
# Name of the branch where you want this job to run on,
# Example: trunk, development, release, main, etc
- main

# Agents pool that hosts runners with the required libraries
pool:
  name: Default

# This should be copied as-is, no modifications
jobs:
- job: fluid_attacks_ai
  displayName: Fluid Attacks AI
  steps:
  - script: |
      python3 -m pip install --upgrade pip
      python3 -m pip install \
        category-encoders==2.3.0 \
        cryptography==35.0.0 \
        gitpython==3.1.20 \
        pandas==1.1.5 \
        prettytable==2.4.0 \
        python-dateutil==2.8.2 \
        requests==2.26.0 \
        tqdm==4.62.3
    displayName: Install dependencies
  - task: fluidattacks-ai@1.0.11
    displayName: Fluid Attacks AI
    inputs:
      azureUsername: azure
      azureToken: "$(System.AccessToken)"
      repositoryUrl: "$(Build.Repository.Uri)"
      repositoryLocalPath: "$(Build.Repository.LocalPath)"
      buildSourceVersion: "$(Build.SourceVersion)"
      repositoryId: "$(Build.Repository.ID)"
      collectionUri: "$(System.CollectionUri)"
      projectName: "$(System.TeamProject)"
```

Then click on **save**.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/edit-pipeline-save-1.png)

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/edit-pipeline-save-2.png)

### Running Fluid Attacks AI

At this point Fluid Attacks AI should run on every commit that you
do to your project.

Alternatively you can schedule a pipeline to run
by clicking on **Run pipeline**:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/run-pipeline-1.png)

And then **Run**:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/run-pipeline-2.png)

At this point you can see the Fluid Attacks AI logs:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/99e2531f95d9abfe8127076c62a087df751f7e74/docs/static/run-pipeline-3.png)

The tool will tell you for each file
the probability of containing security vulnerabilities.
