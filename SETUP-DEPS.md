## Installing Dependencies

If you are using a yum-based distribution of Linux, you can create a script from the following shell commands that should install the dependencies.

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -Rf aws
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
cat << EOF >> /home/ec2-user/.bash_profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
source /home/ec2-user/.bash_profile
nvm install 16
nvm use 16
npm install -g npm nodejs typescript aws-sdk aws-cdk
```

Please refer to the documentation for all relevant packages for installation instructions if you are not running a version of Linux that uses "yum" for installs.
## Disclaimer

Deploying the Amazon Chime SDK demo application contained in this repository will cause your AWS Account to be billed for services, including the Amazon Chime SDK, used by the application.
## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
