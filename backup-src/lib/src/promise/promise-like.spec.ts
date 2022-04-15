import { DummyPromise } from './promise-like';

let cond = true;

const p = new DummyPromise(function(resolve, reject) {
    if (cond) {
        resolve(true);
    } else {
        reject('error');
    }
});

const q = p as PromiseLike<any>;

describe('DummyPromise', () => {
    it('ctor', () => {
        expect(p).toBeDefined();
    });

    it('promise like', () => {
        expect(q).toBeDefined();
        expect(q.then).toBeDefined();
        expect(q['catch']).toBeDefined();
        expect(q['all']).toBeDefined();
    });

    it('Resolved', function(done) {
        p.then(function(result) {
            expect(result).toBe(true);
            done();
        });
    });

});
