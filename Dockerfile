FROM nginx:stable
MAINTAINER Johnny Blaesta<johnny.blasta@sundsvall.se>
RUN apt-get update --allow-releaseinfo-change && apt-get install -y apt-utils && apt-get install -y curl gnupg
RUN curl -SLO https://deb.nodesource.com/nsolid_setup_deb.sh
RUN chmod 500 nsolid_setup_deb.sh
RUN ./nsolid_setup_deb.sh 20
RUN apt-get update -y && apt-get install -y nodejs
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY ./kod ./
RUN npm install
RUN npm run build
COPY ./custom/css/ ./css
COPY ./custom/img/png/ ./img/png/

EXPOSE 80
