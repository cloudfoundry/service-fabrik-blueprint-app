'use strict';

/*!
 * Common modules
 */

/*!
 * Attach chai to global
 */
global.chai = require('chai');
global.expect = global.chai.expect;
/*!
 * Chai Plugins
 */
global.chai.use(require('chai-spies'));
global.chai.use(require('chai-http'));
/*!
 * Blueprint-Service Config
 */
global._ = require('lodash');
const init = require('../../lib/init');
const blueprintService = _.result(_.first(init.getBlueprintServices()), 'credentials');
global.blueprint = {
  username: blueprintService.username,
  password: blueprintService.password,
  hostname: blueprintService.hostname,
  ports: blueprintService.ports,
  port: blueprintService.port || _.result(blueprintService.ports, '8080/tcp') || 0,
  adminuser: process.env.ADMINUSER,
  adminpass: process.env.ADMINPASS
};