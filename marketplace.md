# Fluid Attacks AI

[Fluid Attacks](https://fluidattacks.com) AI
detects the files in your repository that are most likely to contain security vulnerabilities, enabling you to prioritize them.

This repository contains an Azure DevOps extension
so you can use Fluid Attacks AI in your Azure projects.

## Getting started

This tutorial will guide you through
creating an Azure DevOps project from scratch and configuring Fluid Attacks AI on it.

The result of this tutorial
is also stored on a public repository at Azure DevOps:

- https://dev.azure.com/fluidattacks/sorts-example

### Requirements

* An Azure account
* An Azure organization and project
* An Azure agent with:
    - enough [parallel jobs](https://docs.microsoft.com/en-us/azure/devops/pipelines/licensing/concurrent-jobs?view=azure-devops&tabs=ms-hosted) as to be able to run a pipeline in your project, and
    - the following dependencies:
      - python3;
      - python3-pip;
      - python3-setuptools.
* Sufficient permissions to:
    - install extensions from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/), and
    - create Azure pipelines in the project.
* An active session (just login to your account)

### Install the extension

To install the extension in your Azure organization, simply click on the **Get it free** button at the top of this website.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/get-it-free-at-the-marketplace.png)

### Setup Azure Pipelines in your project

> This step is optional if your project has already configured Azure Pipelines

1. In your project, navigate to the Pipelines section and click on the **Create Pipeline** button.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/create-pipeline-view.png)

2. Now follow the wizard. Our code is located in **Azure Repos Git**.


![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/create-pipeline-view-connect.png)

3. Select the repository:

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/create-pipeline-view-select-repo.png)

4. Finally click on **Save**.

At the end of this process, you will have your first Azure Pipeline.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/create-pipeline-view-review-and-save.png)


![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/create-pipeline-view-finished.png)

### Configuring the pipeline

At this point, you can proceed with the customization of your *azure-pipelines.yml* file.

1. Go to the Pipelines view of your project and click on **Edit**.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/edit-pipeline.png)

2. Copy and paste the following content (be sure to make the modifications explained in the code comments):

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
  - task: fluidattacks-ai@1
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

3. Click on **Save**.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/edit-pipeline-save-1.png)

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/edit-pipeline-save-2.png)

### Running Fluid Attacks AI

Now, Fluid Attacks AI should run on every commit you make to your project.
 
Alternatively, you can schedule a pipeline to run:
1. Click on **Run Pipeline**.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/run-pipeline-1.png)

2. Click on the **Run** button.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/run-pipeline-2.png)

At this point you can see the Fluid Attacks AI logs.

![](https://raw.githubusercontent.com/fluidattacks/ai-extension-azuredevops/ec9284761d9e5cd1907e28fbebce3bf019612c39/docs/static/run-pipeline-3.png)

The tool will tell you the probability of containing security vulnerabilities for each file.
