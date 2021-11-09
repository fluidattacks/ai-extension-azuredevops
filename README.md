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
1. Sufficient permissions to:
    - Install extensions from the
      [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
    - Create Azure pipelines
      in the project
1. An active session (just login to your account)

### Install the extension

Please visit
[Fluid Attacks AI at the Marketplace](https://marketplace.visualstudio.com/items?itemName=FluidAttacks.sortsxtension)
and install it in your Azure organization
by clicking on the **Get it free** button.

### Configure the pipeline

Include it in your pipeline *yaml* definition file. Below, you have an example *yaml*.
You'll find that you need to set up a few input variables to Sorts. Most of them are just [Azure Build Environment Vars](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml#pipeline-variables-devops-services). You will also need to have an Azure personal token. You can generate one following this [steps](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page).

```
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
  - script: echo Hello World Sorts in your Pipeline!
    displayName: 'Run a one-line echo'

  - script: |
    echo Installing additional Python packages.
    python -m pip install \
      gitpython \
      pandas \
      cryptography \
      prettytable \
      tqdm \
      category-encoders
    displayName: 'Install extra python packages'

  - task: azure_sorts_test@0
    inputs:
      azureUsername: YOUR_PERSONAL_AZURE_USERNAME
      azureToken: YOUR_PERSONAL_AZURE_TOKEN
      repositoryUrl: '$(Build.Repository.Uri)'
      repositoryLocalPath: '$(Build.Repository.LocalPath)'
      buildSourceVersion: '$(Build.SourceVersion)'
      repositoryId: '$(Build.Repository.ID)'
      collectionUri: '$(System.CollectionUri)'
      projectName: '$(System.TeamProject)'
```
