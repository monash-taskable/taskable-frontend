# Monash Taskable Frontend Components

Frontend written in Nuxt 3, with Vue 3 composition API.

### External Dependencies

#### 1. `pnpm` from `corepack` is *Highly Recommended*

Most utilities and scripts in this project are built on top of the `pnpm` package manager for NodeJS.
Although managing package managers such as `npm` or `yarn` is also usable for this project, it is not very well supported in the added scripts and documentation resources. (You will have to re-write some part of the scripts to make them work).

`pnpm` is part of the `corepack` toolbox. `corepack` can be simply enabled without the need to install them manually (as it should be installed together with NPM). Instructions can be found [here](https://nodejs.org/api/corepack.html#enabling-the-feature).

#### 2. Proto Compiler

This project may require the `protoc` command from protobuf compiler implementations.

If you're using macos, install the `protobuf` package using Homebrew:

```shell
brew install protobuf
protoc --version # check if the installation is working
```

If you're using linux, here are some packages for common distros:

* [`protobuf-compiler` - Ubuntu](https://packages.ubuntu.com/noble/protobuf-compiler)
* [`protobuf` - Arch Linux](https://archlinux.org/packages/extra/x86_64/protobuf/)

If you're using windows, *get a better OS (recommended)*, or use one of the following ways

* [Official release](https://github.com/protocolbuffers/protobuf/releases) on Github (Recommended)
* Commandline with Chocolatey `choco install protoc`

#### 3. Global `protoc-gen-js` Package

You also need an extra package to allow proto compiler to generate the JavaScript logic for .proto files.

Install `protoc-gen-js` using your favourite node package manager (`pnpm` is recommended)

```bash
# Using pnpm to install `protoc-gen-js`, but you can use npm, yarn or anything you like
pnpm i -g protoc-gen-js
```

### Development, Test and Build

To develop and test the project:
1. Clone the repository and cd into the workspace
2. Use your favourite package manager (`pnpm` is recommended) and install all dependencies (e.g. `pnpm i`).
3. Run development server with `dev` subcommand (e.g. `pnpm run dev`).
4. Check ip address in terminal and open it in a browser.

To build the production server:
1. idk, might update the steps later :P

### Documentation

Other than typical Nuxt pattern, there are an extra directory called [`documentation/`](/documentation/) with markdown files describing some rules, conventions and structures specific to this project (i.e. Monash Taskable Frontend).


### Licences

To be decided.