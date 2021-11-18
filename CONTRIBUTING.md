# Azure account

1. Use Okta to login as **Azure - continuous**.
  This account has admin access
  to Azure so you can perform any action

# Azure DevOps

1. Use this organization for your tests:
    - https://dev.azure.com/fluidattacks/

    You can create new projects if needed
1. This project is used as example of how to setup Fluid Attacks AI:
    - https://dev.azure.com/fluidattacks/sorts-example

    Please keep it updated
    and try not to break it,
    because customers use it as reference material.
    Also, if you break it, you also break the customer projects
    because both are setup the same way.

# Azure Pipelines

In order to use Azure Pipelines you need to use your laptop as an agent.
This guide reflects what's stated here:
- https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/docker?view=azure-devops

## Create a Personal Access Token

Generate a Personal Access Token (PAT)
with Agent Pools (read, manage) scope,
created by a user who has permission to configure agents, at AZP_URL.
- https://dev.azure.com/fluidattacks/_usersSettings/tokens

## Launch the local agent

```bash
$ docker build -t dockeragent:latest test/azure-agent

$ docker run -ti \
  -e AZP_URL='https://dev.azure.com/fluidattacks' \
  -e AZP_TOKEN="${AZP_TOKEN}" \
  -e AZP_AGENT_NAME='agent' \
  dockeragent:latest
```

At this point you'll be able to see the agent here:
- https://dev.azure.com/fluidattacks/_settings/agentpools

And everytime you schedule a pipeline
(by pushing a commit or running it manually through the Azure GUI)
it will run

# Releasing

The extensions are versioned with [semver](https://semver.org/).

**ANY** change you do **MUST** increase the semver according to the specification.
This is done in two places at the same time:
- vss-extension.json
- sorts_extension/task.json

Make sure to also update the documentation and the example project
**before** releasing.

## To Visual Studio Market Place

### Compile the project

Run `./pack.sh` (We tested it with node 14).

### Upload the project to the Market Place

Ask your manager for credentials to access the Market Place

Then go here:
- https://marketplace.visualstudio.com/manage/publishers/fluidattacks

And update the extension
by uploading `FluidAttacks.ai-xxxx.vsix` (`xxx` may change)
through the GUI.
