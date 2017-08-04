'use strict';

describe('Tests for the resource /files', function () {
  this.timeout(60000);

  describe('/files', function () {
    describe('GET', function () {
      it('returns status 200 and a JSON object', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/files')
          .auth(blueprint.username, blueprint.password)
          .then((res) => expect(res).to.have.status(200));
      });

      it('returns status 401', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/files')
          .auth('non-existing-user', 'non-existing-pass')
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(401));
      });
    });
  });

  describe('/files/{fileName}', function () {
    describe('PUT', function () {
      it('returns status 201', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .put('/v1/files/test-file-1a2b3c-01')
          .auth(blueprint.username, blueprint.password)
          .send({
            'dummy text 01': null
          })
          .then(res => expect(res).to.have.status(201));
      });

      it('returns status 200', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .put('/v1/files/test-file-1a2b3c-01')
          .auth(blueprint.username, blueprint.password)
          .send({
            'dummy text 01': null
          })
          .then(res => expect(res).to.have.status(200));
      });

      it('returns status 401', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .put('/v1/files/test-file-1a2b3c-01')
          .auth('non-existing-user', 'non-existing-pass')
          .send({
            'dummy text 01': null
          })
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(401));
      });
    });

    describe('GET', function () {
      it('returns status 201 and the content of the file', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/files/test-file-1a2b3c-01')
          .auth(blueprint.username, blueprint.password)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.text).to.eql('dummy text 01');
          });
      });

      it('returns status 401', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/files/test-file-1a2b3c-01')
          .auth('non-existing-user', 'non-existing-pass')
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(401));
      });
    });

    describe('DELETE', function () {
      it('returns status 200', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .delete('/v1/files/test-file-1a2b3c-01')
          .auth(blueprint.username, blueprint.password)
          .then(res => expect(res).to.have.status(200));
      });

      it('returns status 401', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .delete('/v1/files/test-file-1a2b3c-01')
          .auth('non-existing-user', 'non-existing-pass')
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(401));
      });

      it('returns status 404', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .delete('/v1/files/a-file-which-will-definitely-not-exist')
          .auth(blueprint.username, blueprint.password)
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(404));
      });
    });
  });

  describe('/files/metadata/{fileName}', function () {
    describe('POST', function () {
      it('returns status 201', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .post('/v1/files/metadata/a-large-file')
          .query({
            size: 1
          })
          .auth(blueprint.username, blueprint.password)
          .then(res => expect(res).to.have.status(201));
      });

      it('returns status 401', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .post('/v1/files/metadata/a-large-file')
          .query({
            size: 100
          })
          .auth('non-existing-user', 'non-existing-pass')
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(401));
      });

      it('returns status 409', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .post('/v1/files/metadata/a-large-file')
          .query({
            size: 1
          })
          .auth(blueprint.username, blueprint.password)
          .catch(err => err.response)
          .then(res => expect(res).to.have.status(409));
      });

      it('verifies the file size of 1 MB', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .get('/v1/files')
          .auth(blueprint.username, blueprint.password)
          .then(res => {
            expect(res).to.have.status(200);
            expect(_.filter(res.body.results, result => result.name === 'a-large-file')[0].size).to.eql(1000000);
          });
      });

      it('cleans up by deleting the created file', function () {
        return chai
          .request(`http://${blueprint.hostname}:${blueprint.port}`)
          .delete('/v1/files/a-large-file')
          .auth(blueprint.username, blueprint.password);
      });
    });
  });
});