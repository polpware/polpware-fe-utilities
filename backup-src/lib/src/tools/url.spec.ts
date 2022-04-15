import * as url from './url';

describe('urlEncodePair', () => {

    it('One pair is added', () => {
        const res = [];

        url.urlEncodePair('name', 'xx', res);

        expect(res.length).toEqual(1);
    });
});

describe('getQueryParamByName', () => {

    it('name = xx', () => {
        const value = url.getQueryParamByName('name', '?name=xx');

        expect(value).toEqual('xx');
    });
});
