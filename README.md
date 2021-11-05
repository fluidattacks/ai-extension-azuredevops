# Sorts AzureDevops Extension

Execute Sorts in your AzureDevOps CI/CD by including this extensions in your pipelines.
Sorts is a Machine Learning based tool able to give predictions about the vulnerability risk of your code, file by file.

## Set up Sorts in your CI/CD

You need two things. First, install the [extension](https://marketplace.visualstudio.com/items?itemName=FluidAttacks.sor2tpOii3sfdsxxx).
Second, you need to include it in your pipeline *yaml* definition file. Below, you have an example *yaml*.
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
