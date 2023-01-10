FROM node:14

# Ensure packages are up to date
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    figlet \
    nano

RUN npm install -g aurelia-cli
RUN npm install -g pm2@latest

# Setup entrypoint
COPY Docker/entrypoint.web.sh /bin/docker-entrypoint.web.sh
RUN chmod +x /bin/docker-entrypoint.web.sh

# Setup user and group
#ARG USER_ID
#ARG GROUP_ID
#
#RUN addgroup --gid $GROUP_ID imy
#RUN adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID imy
#RUN chown -R $USER_ID:$GROUP_ID /opt
USER node

WORKDIR /opt/imy



