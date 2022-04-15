import * as str from './str';


describe('replace', () => {

    it('Replace with 0', () => {
        const r = str.replace('three{number}', { number: 0 });

        expect(r).toEqual('three0');
    });
});
