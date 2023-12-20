# Nitric CLI - Automated Cloud Deployment

![](https://github.com/nitrictech/actions/workflows/build-test/badge.svg)
![](https://github.com/nitrictech/actions/workflows/CodeQL/badge.svg)

[Nitric](https://nitric.io) is an
[open source framework](https://github.com/nitrictech/nitric) for developing
cloud applications in your language of choice and then easily deploying with
auto-provisioned infrastructure in AWS, Azure or Google Cloud.

With Nitric’s GitHub Action, you can automate your cloud deployment of your
application with the right cloud-native infrastructure, so that each commit to
your GitHub repo triggers a deployment to the stack you’ve configured.

Note: This action is designed to be run on `ubuntu-latest` due to limitations on
MacOS runners and Windows VMs. It ensures the installation and exposure of a
specified version of the Nitric CLI on the GitHub Actions runner environment.

## Usage

```yaml
name: Nitric
on:
  push:
    branches:
      - main
jobs:
  up:
    name: Update
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4

      - name: Install and configure Pulumi 📦
        uses: pulumi/actions@v4

      - name: Applying infrastructure 🚀
        uses: nitrictech/actions@v1
        with:
          command: up
          stack-name: dev # replace with your stack
        env:
          PULUMI_CONFIG_PASSPHRASE: ${{ secrets.PULUMI_CONFIG_PASSPHRASE }}
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

This will check out the existing directory and run nitric up.

## Inputs

The actions supports the following inputs:

| Name         | Type   | Description                                                                                                                              | Default  | Required                  |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| `version`    | String | Nitric CLI version (or `latest`)                                                                                                         | `latest` | false                     |
| `command`    | String | The command to run as part of the action. Accepted values are up and down. If unspecified, the action will stop after installing Nitric. |          | false                     |
| `stack-name` | String | The name of the stack that Nitric will be operating on. The stack file should be located in the working directory.                       |          | When command is specified |

## Installation Only

If you want to only install the Nitric CLI, omit the `command` field of the
action.

```yaml
- uses: nitrictech/actions@v1
```

## Specific Version

A specific version of the `Nitric` CLI can be installed:

```yaml
steps:
  - uses: nitrictech/actions@v1
    with:
      version: 1.33.3
```

## Examples

Below are some example workflows:

- [AWS](examples/aws.yaml)
- [Azure](examples/azure.yaml)
- [Google Cloud](examples/gcp.yaml)

## Develop

Install the dependencies

```bash
npm install
```

Build the typescript and package it for distribution

```bash
npm run package
```

Run the tests

```bash
npm test
```

## Release

To publish the action, we use
[JasonEtco/build-and-tag-action](https://github.com/JasonEtco/build-and-tag-action).
This automates the build and tagging process.

```bash
npm run all
```

## More info and support

To learn more about Nitric, check out the docs at https://nitric.io/docs,
including
[resources for getting started](https://nitric.io/docs/guides/getting-started)
and a step-by-step guide for setting up
[continuous deployment with GitHub Actions](https://nitric.io/docs/guides/getting-started/github-actions).

For questions and support, please get in touch through
[GitHub Discussions](https://github.com/nitrictech/nitric/discussions) or
[Discord](https://nitric.io/chat).
