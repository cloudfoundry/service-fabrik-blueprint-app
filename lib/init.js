'use strict';

const _ = require('lodash');

if (process.env.NODE_ENV === 'local') {
  process.env.VCAP_SERVICES = '{"blueprint":[{"credentials":{"hostname":"localhost","port":"8080","ports":{"8080/tcp":"55697","9090/tcp":"44253"},"username":"admin","password":"admin"}}]}';
}

function blueprintServiceBound() {
  let services = {};

  if (_.has(process.env, 'VCAP_SERVICES')) {
    services = JSON.parse(process.env.VCAP_SERVICES);
  }

  return _.has(services, 'blueprint');
}

module.exports.getBlueprintServices = () => {
  if (!blueprintServiceBound()) {
    console.log('Caution: No blueprint-service is bound to the application.');
    return [{
      credentials: {
        username: '',
        password: '',
        hostname: '',
        port: '',
        ports: {}
      }
    }];
  } else {
    return _.result(JSON.parse(process.env.VCAP_SERVICES), 'blueprint');
  }
};