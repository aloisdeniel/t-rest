# T-Rest


Start a simple rest api for prototyping purposes.

## Install

```sh
$ npm install -g t-rest
```

## Usage

In the folder of the server, a configuration file `config/default.yaml` ([node-config](https://github.com/lorenwest/node-config/wiki/Configuration-Files)) is needed with these properties :

* `port` *(default:`3000`)* : the server port.
* `title` *(default: `"API"`)*: the title of the api.
* `description` *(default: `"A prototype api."`)* : a short description of the api.
* `version` *(default: `"1.0.0"`)* : the version of the api.
* `root` *(default: `"/api"`)* : the root path of the api.

```yaml
port: 3000
title: Basic
description: A basic t-rest example of task rest api.
version: 1.0.1
root: /api
```

A file `entity/{route}.yaml` containing the schema of each entity you want to expose must be created.

Then simply launch the `t-rest` server in the folder.

```sh
$ npm install -g t-rest
$ cd ./myapi
$ t-rest
```

A user interface is available (thanks to [Swagger UI](https://github.com/swagger-api/swagger-ui)) at the root path of the server (*default:* `http://localhost:3000/`) for trying out the api.

## Examples

Multiple examples are available in the `example` folder.

## Roadmap / ideas

* Adding references between objects.
* Cleaning code and documentation.
* Adding More examples.
* Adding subdirectories support for more complex routes.
* Adding simple generators from data sets.

## Copyright and license

MIT © [Aloïs Deniel](http://aloisdeniel.github.io)
