/* global describe it */
module.exports = (server, assert, dataTest) => {
  describe('Ping', () => {
    it('Should Return 202 or 200', (done) => {
      server
        .get('/ping')
        .set('timestamp', dataTest.timestamp)
        .set('Authorization', `Basic ${dataTest.token}`)
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, resp) => {
          const result = resp.body;
          if (err) return done(err);
          assert.equal(result.status, 200);
          return done();
        });
    });
  });
};
