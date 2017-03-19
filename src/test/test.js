'use strict';
/* global it, describe */
/** Imports */
import './helper';

import path           from 'path';
import vm             from 'vm';

import * as chai      from 'chai';

import { transform }  from 'babel-core';


/** Constants */
const babelOptions = {
  plugins: [path.join(__dirname, '../index.js')]
};


/** Helpers */
function runBabelInThisContext(code) {
  return vm.runInThisContext(transform(code, babelOptions).code);
}


/** Init */
const { expect } = chai;


/** Tests */
describe('pipeline operator', () => {
  it('should work', function () {
    transform(`
      ((user) => {
        return user.name
          |> capitalize
          |> sayHello;
      });
    `, babelOptions);

    transform(`
      ((user) => {
        return user.score
          |> (_ => _ * 2)
          |> (_ => _.toFixed(3));
      });
    `, babelOptions);

    transform(`
      (() => {
        return (rootDir, filePath) => [rootDir, filePath]
          |> ((args) => path.relative(...args))
          |> path.dirname
          |> ((res) => res.split(path.sep).join(path.posix.sep))
          |> ((res) => '/' + (res === '.' ? '' : (res + '/')))
          |> ((res) => res.replace(/@/g, ':'));
      });
    `, babelOptions);
  });

  it('should return valid result', function () {
    const helloMessage = runBabelInThisContext(`
      (() => {
        const user = { name: 'SuperPaintman' };

        function capitalize(str) {
          return str.toUpperCase();
        }

        function sayHello(name) {
          return 'Hello, ' + name + '!';
        }

        return user.name
          |> capitalize
          |> sayHello;
      });
    `)();

    expect(helloMessage).to.equal('Hello, SUPERPAINTMAN!');


    const doubleScore = runBabelInThisContext(`
      (() => {
        const user = { score: 40.49138 };

        return user.score
          |> (_ => _ * 2)
          |> (_ => _.toFixed(3))
          |> parseFloat;
      });
    `)();

    expect(doubleScore).to.equal(80.983);


    const pathToUrl = runBabelInThisContext(`
      (({ path }) => {
        return (rootDir, filePath) => [rootDir, filePath]
          |> ((args) => path.relative(...args))
          |> path.dirname
          |> ((res) => res.split(path.sep).join(path.posix.sep))
          |> ((res) => '/' + (res === '.' ? '' : (res + '/')))
          |> ((res) => res.replace(/@/g, ':'));
      });
    `)({ path: require('path') });

    expect(pathToUrl('./controllers', './controllers/api/users/index.js'))
      .to.equal('/api/users/');

    expect(pathToUrl('./controllers', './controllers/index.js'))
      .to.equal('/');
  });
});
