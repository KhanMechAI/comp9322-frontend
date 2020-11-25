#FROM alpine:latest

#
#
#RUN apk add --no-cache py-pip
#RUN pip3 install --upgrade pip
#
#COPY . /service
#WORKDIR /service
#
#
#RUN npm install
#ENV PATH="./node_modules/.bin:$PATH"
#RUN npm run build
#
##ENTRYPOINT ["gunicorn", "--config", "src/g_config.py", "src.wsgi:create_app()"]


# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]