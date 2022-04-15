import { safeParseString } from './type-cast';


describe('type cast', () => {
    it('string parser', () => {
        expect(safeParseString(null)).toEqual('');
    });
});
