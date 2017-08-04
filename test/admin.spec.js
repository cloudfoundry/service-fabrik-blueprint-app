'use strict';

if (blueprint.adminuser && blueprint.adminpass) {
  describe('Tests for the resource /admin', function () {
    this.timeout(60000);

    describe('/credentials/{userName}', function () {
      describe('PUT', function () {
        it('returns status 201', function () {
          return chai
            .request(`http://${blueprint.hostname}:${blueprint.port}`)
            .put('/v1/admin/credentials/testuser-01-abc')
            .auth(blueprint.adminuser, blueprint.adminpass)
            .send({
              password: 'abc123'
            })
            .then(res => expect(res).to.have.status(201));
        });

        it('returns status 401', function () {
          return chai
            .request(`http://${blueprint.hostname}:${blueprint.port}`)
            .put('/v1/admin/credentials/testuser-01-abc')
            .auth('non-existing-user', 'non-existing-pass')
            .send({
              password: 'abc123'
            })
            .catch(err => err.response)
            .then(res => expect(res).to.have.status(401));
        });
      });

      describe('DELETE', function () {
        it('returns status 200', function () {
          return chai
            .request(`http://${blueprint.hostname}:${blueprint.port}`)
            .delete('/v1/admin/credentials/testuser-01-abc')
            .auth(blueprint.adminuser, blueprint.adminpass)
            .then(res => expect(res).to.have.status(200));
        });

        it('returns status 401', function () {
          return chai
            .request(`http://${blueprint.hostname}:${blueprint.port}`)
            .delete('/v1/admin/credentials/testuser-01-abc')
            .auth('non-existing-user', 'non-existing-pass')
            .catch(err => err.response)
            .then(res => expect(res).to.have.status(401));
        });

        it('returns status 404', function () {
          return chai
            .request(`http://${blueprint.hostname}:${blueprint.port}`)
            .delete('/v1/admin/credentials/a-user-which-will-definitely-not-exist')
            .auth(blueprint.adminuser, blueprint.adminpass)
            .catch(err => err.response)
            .then(res => expect(res).to.have.status(404));
        });
      });
    });
  });
}