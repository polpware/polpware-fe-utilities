import { hashCode, hashMember } from './hash';


describe('hash', () => {
    it('hashcode bool', () => {
        expect(hashCode(true)).toBe(49);

        expect(hashCode(false)).toBe(0);
    });

    it('hashcode number', () => {
        expect(hashCode(0)).toBe(0);

        expect(hashCode(1)).toEqual(49);
    });

    it('hashcode string', () => {
        expect(hashCode('1')).toEqual(49);
    });


    const configuration = {
        a: 1,
        b: 4,
        c: 10
    };

    it('hashMember', () => {

        let b2 = hashCode(true);
        expect(hashMember('a', true, configuration)).toEqual(b2 << 1);
    });

});
