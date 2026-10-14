# Keyholder-Angular

[![Build Status](https://travis-ci.org/maprox/keyholder-angular.svg?branch=master)](
https://travis-ci.org/maprox/keyholder-angular) 
[![codecov](https://codecov.io/gh/maprox/keyholder-angular/branch/master/graph/badge.svg)](
https://codecov.io/gh/maprox/keyholder-angular)

Hi, this is an Angular 22 Example Project, which can be used as a frontend for
password manager when paired with a simple key-value backend
[keyholder-server](https://github.com/maprox/keyholder-server).

Its **main purpose** is to help learning different aspects of frontend development
using Angular 22, such as authentication, routing, unit testing, etc.

It's not a tutorial but rather a compilation of different ideas/components
I've found over the Internet which were incorporated into one project.

The **secondary goal** was to build free open source password manager which I
will use in everyday life and which can be deployed by anyone in minutes. It was
inspired by [keymemo](https://www.keymemo.com/) and
[padlock](https://github.com/MaKleSoft/padlock) and leverages the same idea of
master password which never leaves your computer because we decrypt/encrypt everything in 
browser and send already encrypted data to the server.

## Getting Started

### Prerequisites

This project targets **Angular 22** and **Node.js 22** (see [Dockerfile](Dockerfile)).
Use a current npm version bundled with Node 22.

> Install [Node.js® and npm](https://nodejs.org/en/download/) if they are not
 already on your machine.

### Installation

Copy project contents (we assume you've got `git` installed, otherwise you can [download](
https://github.com/maprox/keyholder-angular/archive/master.zip) this project)
and go to the project's folder

```bash
git clone git@github.com:maprox/keyholder-angular.git
cd keyholder-angular
```

Install all dependencies

```bash
npm ci
```

You may also [check that tests are green](#running-the-tests) after installation

### Docker

Every project should have a [Dockerfile](Dockerfile). The image is **multi-stage**:
Angular is built with **Node 22**, then static files are served by **nginx**
([nginx-default.conf](nginx-default.conf) — SPA `try_files` fallback; see
[Angular Docs](https://angular.io/guide/deployment#production-servers)).

On every push to `master`, [GitHub Actions](.github/workflows/docker.yml) builds
and pushes `maprox/keyholder-angular:latest` and a short-SHA tag to
[Docker Hub](https://hub.docker.com/r/maprox/keyholder-angular/).
Required repo secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.

In Kubernetes use `image: maprox/keyholder-angular:latest` with
`imagePullPolicy: Always`, then after a release run a rollout restart (or pin a
SHA tag for immutable deploys).

```bash
docker pull maprox/keyholder-angular:latest
```

## Running the tests

This project does not have any e2e tests yet,
so running tests is as simple as running standard

```bash
ng test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
