# babel-plugin-transform-pipeline

[![Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Code Climate][codeclimate-image]][codeclimate-url]


> Compile pipeline operator (`|>`) to ES5


**Proposal**: [mindeavor/es-pipeline-operator][proposal-url]


--------------------------------------------------------------------------------


## Example
### Basic

**In**

```javascript
var user = { name: 'SuperPaintman' };

function capitalize(str) {
  return str.toUpperCase();
}

function sayHello(name) {
  return 'Hello, ' + name + '!';
}

var res = user.name
  |> capitalize
  |> sayHello;

// => "Hello, SUPERPAINTMAN!"
```

**Out**

```javascript
var user = { name: 'SuperPaintman' };

function capitalize(str) {
  return str.toUpperCase();
}

function sayHello(name) {
  return 'Hello, ' + name + '!';
}

var res = sayHello(capitalize(user.name));

// => "Hello, SUPERPAINTMAN!"
```


### With multi-argument functions

**In**

```javascript
var user = { score: 40.49138 };

var res = user.score
  |> (_ => _ * 2)
  |> (_ => _.toFixed(2));

// => 80.98
```

**Out**

```javascript
var user = { score: 40.49138 };

var res = (_ => _ * 2)((_ => _.toFixed(2))(user.score));

// => 80.98
```


### Real use-case

```javascript
var path = require('path');

var pathToUrl = (rootDir, filePath) => [rootDir, filePath]
  |> ((args) => path.relative(...args))
  |> path.dirname
  |> ((res) => res.split(path.sep).join(path.posix.sep))
  |> ((res) => '/' + (res === '.' ? '' : (res + '/')));

pathToUrl('./controllers', './controllers/api/users/index.js');
// => "/api/users/"

pathToUrl('./controllers', './controllers/index.js');
// => "/"
```

**Out**

```javascript
var path = require('path');

var pathToUrl = (rootDir, filePath) => (res => '/' + (res === '.' ? '' : res + '/'))((res => res.split(path.sep).join(path.posix.sep))(path.dirname((args => path.relative(...args))([rootDir, filePath]))));

pathToUrl('./controllers', './controllers/api/users/index.js');
// => "/api/users/"

pathToUrl('./controllers', './controllers/index.js');
// => "/"
```


--------------------------------------------------------------------------------


## FAQ

> Why do we need parentheses around multi-argument functions?

Because they separate the `=>` from the `|>`.

Ie. the following code:

```javascript
var res = user.score
  |> _ => _ * 2
  |> double;
```

Is equivalent to:

```javascript
var res = user.score
  |> _ => _ * double(2);


// or


var secondArg = 2
  |> double;

var res = user.score
  |> _ => _ * secondArg;
```


> Why `|>`?

Firstly, it is a invalid token in terms of javascript (*ES3*-*ES2017*).

Secondly, in vanilla javascript there are only 3 token starting with `|`: `|`, `||` and `|=`;


--------------------------------------------------------------------------------


## Installation

```sh
npm install --save-dev babel-plugin-transform-pipeline

# or

yarn add --dev babel-plugin-transform-pipeline
```


--------------------------------------------------------------------------------


## Usage
### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-pipeline"]
}
```


### Via CLI

```sh
babel --plugins transform-pipeline script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-pipeline"]
});
```


--------------------------------------------------------------------------------

## Build

```sh
npm run build
```


--------------------------------------------------------------------------------

## Test

```sh
npm run test
```


--------------------------------------------------------------------------------


## Contributing

1. Fork it (<https://github.com/SuperPaintman/babel-plugin-transform-pipeline/fork>)
2. Create your feature branch (`git checkout -b feature/<feature_name>`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin feature/<feature_name>`)
5. Create a new Pull Request



--------------------------------------------------------------------------------


## Contributors

- [SuperPaintman](https://github.com/SuperPaintman) SuperPaintman - creator, maintainer


--------------------------------------------------------------------------------


## License

[MIT][license-url]


[license-url]: LICENSE
[travis-image]: https://img.shields.io/travis/SuperPaintman/babel-plugin-transform-pipeline/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/babel-plugin-transform-pipeline
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/babel-plugin-transform-pipeline/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/babel-plugin-transform-pipeline?branch=master
[codeclimate-image]: https://img.shields.io/codeclimate/github/SuperPaintman/babel-plugin-transform-pipeline.svg
[codeclimate-url]: https://codeclimate.com/github/SuperPaintman/babel-plugin-transform-pipeline
[proposal-url]: https://github.com/mindeavor/es-pipeline-operator
