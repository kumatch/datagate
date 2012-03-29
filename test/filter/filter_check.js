
module.exports = function filterCheck(func, title, from, to) {
    it(title, function(done) {
        func(from, function (err, result) {
            (!err).should.ok;

            if (isNaN(result)) {
                isNaN(to).should.ok;
                isNaN(result).should.ok;
            } else {
                (result === to).should.ok;
            }

            done();
        });
    });
};
