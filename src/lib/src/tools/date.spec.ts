import { convertToUtc, getTimezoneOffset } from './date';

describe('date', () => {
    it('convertToUtc', () => {
        const date = new Date(2022, 3, 22, 8, 5);
        const timezone = getTimezoneOffset();
        const ret = convertToUtc(date, date, timezone);
        expect(ret.getUTCHours()).toEqual(date.getHours() - timezone);
    });

});
