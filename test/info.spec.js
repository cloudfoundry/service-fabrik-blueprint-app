'use strict';

describe('Tests for the resource /info', function () {
  this.timeout(60000);

  describe('/info', function () {
    describe('GET', function () {
      it('returns status 200 and a JSON object', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/info')
          .then(res => expect(res).to.have.status(200));
      });
    });
  });
});