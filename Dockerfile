FROM nginx:stable
MAINTAINER Robin Flink<robin.flink@sundsvall.se>
RUN apt-get update --allow-releaseinfo-change && apt-get install -y apt-utils && apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x |bash -
RUN apt-get update -y && apt-get install -y nodejs
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY ./kod ./
RUN npm install
RUN npm run build
COPY ./custom/css/ ./css
COPY ./custom/img/png/ ./img/png/

EXPOSE 80
