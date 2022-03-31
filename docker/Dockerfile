FROM amazonlinux:latest
RUN yum update && yum install -y \
    shadow-utils sudo tar unzip util-linux wget

COPY ./userdata/user_script.sh /
RUN chmod ago+x ./user_script.sh 

RUN cd /root && \
    /user_script.sh; \
    exit 0
