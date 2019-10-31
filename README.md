# Forall Server

Forall is the repository for Formality files.

## Description

This app is built with [Nest](https://github.com/nestjs/nest) framework.

## Running with Docker

If you do not want to configure node and everything, you can run the service in prod mode with
docker by running `docker-compose up -d`. That will start everything in background and you can check the docs for the API on `http://localhost:3000/apidoc`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```