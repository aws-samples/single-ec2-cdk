# Single EC2 CDK Script

This is a simple CDK project that creates a single EC2 instance and copies a common set of tools needed for doing cloud development.  This script handles the undifferentiated heavy lifting of creating a development environment.  While other methods
exist that give similar results from [Cloud9](https://aws.amazon.com/cloud9/) and  [https://www.amazonaws.cn/en/workspaces/](Amazon Workspaces), neither of those automatically installs the entire development environment and pre-configures it for access with a remote editor.  This solution fully automates the creation of your entire development environment.  This solution makes creation of a new EC2 easy and fully repeatable: you can dispose of and re-create your development environment on demand.

The example config (in 'configs/config.json.example') defaults a t3 micro and installs a userdata script at userdata/user_script.sh.  You can add user-specific commands to that by adding a pointer to another file.  

You do need to specify an SSH key name and pem file.  You can optionally set the DNS name and Route53 ZoneID and CDK will update that for you on every EC2 boot.

You should realize that deploying this will incur charges for the EC2 instance from your AWS account.

## Why Would You Need This?

It is especially useful to have an easily available linux server on demand in the cloud.  When you don't need it, you can stop it or even delete it, and recreate it whenever needed.  This is especially useful to to rapid testing on a "clean" linux box, perhaps to ensure that your "new install scripts" work properly, or perhaps because software you installed for another project is not compatible with the work you need to do next.  Or maybe you are working through how to learn something and you don't want to risk polluting your primary development machine.  Or maybe 
you want to follow the steps in an AWS blog or workshop and you want to make sure your own development tools don't conflict.  Any time you need a "clean" linux box for something!  You can even have multiple EC2 instances, one per project, all set up exactly how you need for a specific project.  Just clone this repo into different sub-directories and customize each one.

The challenge of just starting an EC2 server is the initial installation and configuration of basic tools.  This project enables full automation of that.  The default userdata script installs the most up to date AWS CLI and a common set of tools.  You can easily extend that
script to create users and install softare in that users home directory.  Please see 'userdata/example' for a template.  Both of these are easily extensible.  A full description of this is included below.

## Cloning This Repo

We assume you will "use this template" to create a new GitHub repository with your own name.  You can then edit your configuration (see below) and track your changes in git as well, and customize the scripts as needed for your own use.

## Software Installed by Default

In addition to several basic tools, the following software will be installed on the target EC2 host:

* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - AWS Command Line Tools 
* [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) - AWS Cloud Development Kit
* [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) - Serverless Application Model command line tools 
* [jq](https://stedolan.github.io/jq/) - command line JSON processor 
* [nvm](https://github.com/nvm-sh/nvm) - Node Version Manager (llows you to quickly install and use different versions of node)
* [nodejs](https://nodejs.dev/) - Node.js
* [npm](https://www.npmjs.com/) - Node Package Manager
* [typescript](https://www.typescriptlang.org/) - Typescript
* [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) - Yarn, a modern high performance Node package management tool
 
All the software installed is open source with details provided on the listed web sites, or are installed by "yum" from the standard repositories.
  
You can easily expand what is installed by writing a script and setting the userDataFile config variable to point to that file.  

## Why Not Use Cloud9 or Amazon Workspaces?

[Cloud9](https://aws.amazon.com/cloud9/) is a great tool.  So is [https://www.amazonaws.cn/en/workspaces/](Amazon Workspaces).  However, some customers prefer to use tools like Visual Studio Code, or to ssh to a host and use command line tools.  Or they want to easily change
the IAM permissions for the host.  Or most importantly, they want to create a "clean" new development environment to start a new project, or to test that their code will work properly on a clean new environment.  Netiher Cloud9 nor the Amazon Workspaces make that easy to do. 

## Using this Solution with Visual Studio Code

Visual Studio Code has an extension that makes it easy to [do remote development over ssh](https://code.visualstudio.com/docs/remote/ssh).  This tool will automatically add information to the SSH config file for the created EC2 server.  You can open VS Code and immediately
see your new host in the list of available targets.

# Installation Instructions
## AWS Account (Launch Host)

To run this CDK script to create an EC2 instance, you need to configure your AWS Account parameters to enable deploying the application. The easiest way to ensure that you have it configured properly do this:

```bash
aws sts get-caller-identity
```

You should get information about your valid AWS account if it is configured properly.
## Installing Application Dependencies (Launch Host)

You need to install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), [jq](https://stedolan.github.io/jq/download/) and 
the [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm).  You can then use nvm to install the other dependendencies, like this:

```bash
nvm install 16 # installs Nodejs 16
nvm use 16 # selects it
npm install -g npm nodejs typescript aws-sdk aws-cdk yarn # installs the necessary modules
```

An example of the commands to install on a yum-based linux is [here](SETUP-DEPS.md).  However, please always reference the tools installation instructions since installers do mature and change over time.
## Create and Download an EC2 Key Pair/PEM file

Using the AWS console, you will need to create an [Amazon EC2 Key Pair PEM file](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) and download the pem file.  Save it to a safe place on your launch host.  Some folks store it in ~/keys and others store it 
in the ~/.ssh directory.  Note the entire file path for that pem file.  You will need to the provide the filename/path in the configuration below.

If you also want this CDK to automatically set a DNS record for you, you need to create a [Route53 Public Hosted Zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html) and create a host record in that zone.  The CDK script will configure the EC2 instance userdata script to automatically set the IP address for that record every time the instance boots.  You will need to add configuration items (see below).  
## Configuration

Copy the file 'configs/config.json.template' to 'configs/config.json and edit it with your favorite editor:

```json
{
    "stackName": "make this what you want your stack to be named - it needs to be unique to you, per region",
    "ec2Name": "the hostname for the EC2 instance",
    "nickName": "<the name you want to show up in VS Code lists, or to use at the SSH command line>",
    "ec2Class": "t3 (or whatever you want)", 
    "ec2Size": "micro (or whatever you want)",
    "keyName": "the name of the keypair in the EC2 console",
    "keyFile": "the path/name of the pem file for the EC2 keypair",
    "hostedZoneID": "the Hosted Zone ID from the Route53 control panel",
    "domainName": "the domain name for the Hosted Zone ID",
    "userDataFile": "a path/name of a file to an additional file to append to the standard user data file",
    "cdkOut": "cdk-outputs.json",
    "timeBomb": "optional timebomb - any non-zero number is the number of minutes the EC2 should exist before automatically getting destroyed",
    "awsConfig": "folder where your AWS commmand line credentials are stored, ~/.aws by default"
}
```

The cdkOut file can be named anything, but it should have a json extension since it will be a json data file.  CDK writes data there that we use to automate other operations.  It is recommended to leave it to the default value.  The tool "jq" reads from that file to get data for various other commands built into this tool.
## Extra Userdata to Install Your Stuff

Take a look at userdata/example:

```bash
useradd username
usermod -G wheel username
# change to allow sudo in the install scripts
echo "username ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers 
su -c 'cd ~username;git clone https://github.com/username/examplerepo' username
su -c 'cd ~username/examplerepo;./install' username
# change it back for safety later
sed -i.bak '/username/d' /etc/sudoers
```

If you make a file like this and swap "username" for your own username then the CDK project will append this onto the userdata script.  This example adds a specific user, adds them to the wheel group (so the have sudo access on Amazon Linux) and
then grants temporary no passwd sudo access and runs an install script from a cloned git repo.  This example grants no passwd access to enable the script to "sudo" without prompting for a password.  The script removes that setting when done per best practice.

# Usage 

Just type 'yarn install' then 'yarn deploy' to deploy the solution and add the host to your .ssh/config file to make it easy to connect.  Once deployed, "yarn prep" will copy your AWS and SSH credentials to the new instance.  You can then just ssh to the "nickname" you set in the config file.  
## Deploy

```bash
yarn depoy
```
Builds and deploys the instance stack and configures your SSH config to know about the instance via the "nickname" you set.  Batteries Included!
## SSH to Host

You can just "ssh <nickName>" and SSH will pull the target IP and keyfile out of the .ssh/config file.  No more messing with typing out the keyfile name!  Batteries included!  

If your EC2 host was restarted for any reason, it will get a new IP address and your SSH config file will be incorrect.  This will manifest as the ssh command hanging and failing to connect. You can verify that the instance is available with "yarn status" and if it seems that it rebooted you can easily fix your config.  To rewrite your ssh config file, you can just run this command: 

```bash
yarn setssh
```
## Install AWS Credentials

By default the EC2 host will have very limited AWS credentials.  To do cloud development you will need to set your AWS credentials on the EC2 host.  To make that simple, you can run this command:

```bash
yarn creds
```
This will copy your AWS credentials to the host.  If your credentials are not in the default location, you can point to the folder where they reside using the awsConfig parameter in the configs/config.json file.  This command is included in the "yarn prep" script.

## Copying the SSH Keys (to enable using git, etc)

There's a helper script to copy your pem file to the destination host.  You should have already deployed the EC2 and run "yarn setssh" for this to work.  Just:

```bash
yarn copykeys
```

The helper will also extract your public key from the pem file and write it to your .ssh directory.  You will need to copy that public key to the service you wish to connect to from your EC2 (such as GitHub or GitLab).  The default userdata script will
add a command to the /etc/profile file to load the pem file into the SSH agent when you log in.  This script is also included as part of the "yarn prep" script.
## Handling an Error When Using SSH

If something fails and you cannot connect using "ssh <nickname>" you can easily ssh to the host using:

```bash
yarn ssh
```

This will connect you to the host by automatically setting the command line parameters for your SSH key and will connect you as "ec2-user" instead of your normal username.  This may be necessary, for example, if the extra script you configured in the userDataFile 
parameter had some kind of error that rendered your user inoperable.

## Destroy Stack

If you want to completely tear down the EC2 instance and all associated resources, use this command:

```bash
yarn destroy
```
which basically runs "cdk destroy" for you.
## Stop and Start the Instance (to save money)

You can start and stop the instance with the following commands:

```bash
yarn stop
yarn run v1.22.17
$ scripts/ec2 stop
{
    "StoppingInstances": [
        {
            "CurrentState": {
                "Code": 64,
                "Name": "stopping"
            },
            "InstanceId": "i-08025470eb8dabb7a",
            "PreviousState": {
                "Code": 16,
                "Name": "running"
            }
        }
    ]
}
✨  Done in 2.58s.
```
You can check the running state of your instance with:

```bash
yarn status
yarn run v1.22.17
$ scripts/ec2 status
ec2 instance i-08025470eb8dabb7a is stopped
✨  Done in 1.37s.
```

You can restart your instance with:

```bash
yarn start
yarn run v1.22.17
$ scripts/ec2 start
{
    "StartingInstances": [
        {
            "CurrentState": {
                "Code": 0,
                "Name": "pending"
            },
            "InstanceId": "i-08025470eb8dabb7a",
            "PreviousState": {
                "Code": 80,
                "Name": "stopped"
            }
        }
    ]
}
✨  Done in 2.50s.
88665a1e55c0:~/src/cdk/single-ec2-dev> yarn status
yarn run v1.22.17
$ scripts/ec2 status
ec2 instance i-08025470eb8dabb7a is running
✨  Done in 1.15s.
```

NOTE:  after restarting, your EC2 instance will have a new IP address.  To get the batteries included again, just run 'yarn setssh' and it will fix your ssh config, and also clear the old info from the SSH known hosts file.
## Cleaning Up the Folder

```bash
yarn clean
```

Cleans up all the build files.  NOTE:  this will delete the stack state data files.  It's really only meant for development to test a clean install.

# Disclaimer

Deploying the the CDK will build a CloudFormation stack that will cause your AWS Account to be billed for the use of the EC2 instance that is created.

# Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

# License

This code is licensed under the MIT-0 License. See the [LICENSE file](https://github.com/aws-samples/single-ec2-cdk/blob/main/LICENSE).
