## Synopsis

Setting up a monolithic repository in JavaScript (lerna) can be a bit daunting. This template adresses common use-cases for sharing functionality across multiple packages.

## Installation

### Prerequisites

Ensure you have installed (globally) the following software on your system:

- [`node.js`](http://nodejs.org/) ^11.0.0 (see .node-version)
- [`yarn`](https://yarnpkg.com/) ^1.12.3
- [`watchman`](https://facebook.github.io/watchman/docs/install.html) ^4.9.0

```sh
# using homebrew
$ brew install node watchman yarn
```

### Setup

This project uses a structure based on [lerna](https://lernajs.io/). To get started clone the repo and then:

```sh
$ npm install --global lerna
$ lerna bootstrap
```

## Root Scripts

Check the (root) `package.json`. By default you have the following scripts:

```sh
# build all packages
$ yarn build

# test all packages
$ yarn test

# lint all packages
$ yarn lint
```

## Package scripts

To start a package, `cd` into its directory and run `yarn start`.

```sh
$ cd packages/alphavantage-stockgraph
$ yarn start
```

You can also run the following scripts that will only affect the current package.

```sh
# build the package
$ yarn build

# test the package
$ yarn test

# lint the package
$ yarn lint
```

## Things to consider

### General Application Concepts

- [`React`](https://reactjs.org) for building user interfaces
- [`Bootstrap`](https://fezvrasta.github.io/bootstrap-material-design/) for a general CSS
- [`css-modules`](https://github.com/css-modules/css-modules) for local CSS scoping

### Testing / Linting

- [`Jest`](https://facebook.github.io/jest/) for testing
- [`Enzyme`](https://github.com/airbnb/enzyme) for easier React component testing
- [`testdouble`](https://github.com/testdouble/testdouble.js) for mocking/stubbing/spying in tests
- [`eslint`](http://eslint.org/) for linting JavaScript
- [`prettier`](https://prettier.io/) for automatic code formatting

### JavaScript

- [`Babel`](http://babeljs.io/) for transpiling JavaScript
- [`webpack`](https://webpack.js.org/) for module bundling

### HTML/CSS

- [`PostCSS`](http://postcss.org/) for transforming CSS
- [`cssnext`](http://cssnext.io/) for using tomorrow's CSS syntax today
