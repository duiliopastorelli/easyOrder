'use strict';

let expect = require('chai').expect;

describe('Array check (demo)', () => {
    it('Expect be an array that does not include the number 3', () => {
        expect([1, 2]).to.be.an('array').that.does.not.include(3);
    });
});