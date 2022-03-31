# Using Docker for development

As an alternative to setting up an [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/pm/ec2/) instance, a [Docker](https://www.docker.com/) container can be created to provide a repeatable environment.

The provided [Dockerfile](./Dockerfile) uses [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2) and builds on it with the provided [user script](../userdata/user_script.sh) to create an equivalent environment on your local desktop or any Docker host.


### Build the Docker image

```bash
cd <project_root>

docker build --rm -t chime-ws-dev -f docker/Dockerfile .
 ```

 _NOTE_: `user_script.sh` will error in setting some of the local variables and DNS entries. However, this may not be needed for all development tasks. If this is important for your work, you may wish to modify `user_script.sh` or simply deploy to EC2.

### Run Container with interactive terminal

```bash
docker run -v $HOME/.aws:/root/.aws:rw -it --entrypoint /bin/bash chime-ws-dev
```

_NOTE_: the AWS credentials and configuration are shared from the host to the guest container. If this is not desired, you may adjust the `-v` mount or otherwise configure the Command Line Interface (CLI).
