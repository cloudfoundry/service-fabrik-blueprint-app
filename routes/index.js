'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const path = require('path');
const uuid = require('uuid');
const Promise = require('bluebird');
const Mocha = require('mocha');
const cheerio = require('cheerio');
const fs = Promise.promisifyAll(require('fs'));
require('../test/support');

class BlueprintReportGenerator {
  constructor() {
    this.tests = {};
  }

  run(testName, type) {
    const executeAllTests = testName === 'all';
    const id = uuid.v1();

    return new Promise((resolve, reject) => {
      this.tests[id] = {
        name: testName,
        type: type || 'html',
        timestamp: Date.now(),
        resolve: resolve,
        reject: reject,
        timeoutObject: setTimeout(() => {
          this.reject(id, new Error('Timeout. The blueprint-service is not reachable most likely.'));
        }, 20000)
      };

      const mocha = new Mocha({
        reporter: 'mochawesome',
        reporterOptions: {
          reportDir: '.',
          reportName: id,
          inlineAssets: false
        }
      });

      if (executeAllTests) {
        fs.readdirAsync(path.join(__dirname, '..', 'test'))
          .then((files) => {
            _.forEach(_.without(files, 'support'), (filename) => {
              const file = path.join(__dirname, '..', 'test', filename);
              delete require.cache[file];
              mocha.addFile(file);
            });
          })
          .then(() => {
            mocha.run();
          })
          .catch((err) => {
            this.reject(id, err);
          });
      } else {
        const file = path.join(__dirname, '..', 'test', `${testName}.spec.js`);
        delete require.cache[file];
        mocha.addFile(file);
        mocha.run();
      }
    });
  }

  resolve(id, result) {
    if (this.tests[id]) {
      this.tests[id].resolve(result);
      clearTimeout(this.tests[id].timeoutObject);
      delete this.tests[id];
    }
  }

  reject(id, err) {
    if (this.tests[id]) {
      this.tests[id].reject(err);
      delete this.tests[id];
    }
  }

  transformData(type, data) {
    switch (type) {
    case 'html':
      {
        const $ = cheerio.load(data);
        $('head').find('link[rel=stylesheet]').each((i, elem) => {
          let link = $(elem);
          link.attr('href', `/${link.attr('href')}`);
        });
        $('body').find('script').each((i, elem) => {
          let script = $(elem);
          script.attr('src', `/${script.attr('src')}`);
        });
        return $.html();
      }
    case 'json':
      {
        return JSON.parse(data);
      }
    default:
      {
        return data;
      }
    }
  }

  generateReport() {}

  saveToFile(data, outFile, callback) {
    let decomposedOutFile = outFile.split('.');
    let id = decomposedOutFile[0];
    let type = decomposedOutFile[1];

    if (this.tests[id] && type === this.tests[id].type) {
      this.resolve(id, this.transformData(type, data));
    }
    process.nextTick(callback);
  }
}

const blueprintReportGenerator = new BlueprintReportGenerator();
const reportGenerator = require('mochawesome/lib/reportGenerator');
reportGenerator.generateReport = blueprintReportGenerator.generateReport.bind(blueprintReportGenerator);
reportGenerator.saveToFile = blueprintReportGenerator.saveToFile.bind(blueprintReportGenerator);


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/info', (req, res) => {
  res.send(process.env);
});

router.get('/test', (req, res, next) => {
  let format = req.query.format || req.accepts(['html', 'json']);

  blueprintReportGenerator.run('all', format)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
});

router.get('/test/:testName', (req, res, next) => {
  let testName = req.params.testName;
  let format = req.query.format || req.accepts(['html', 'json']);

  blueprintReportGenerator.run(testName, format)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
});


module.exports = router;
