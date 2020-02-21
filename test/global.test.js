'use strict';

import chai, {expect} from 'chai';
import setupme from '../src/index';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const getFirst = ([first, _]) => first;

describe('setupme', () => {
    beforeEach(() => {
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('empty', () => {
        expect(setupme.validate({}, {}).success).to.be.true;
    });

    it('non valid option', () => {
        const {success, errors} = setupme.validate({}, {option: 1});

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({error: 'INVALID', key: 'option'});
        expect(console.error).to.be.calledOnceWith('[setupme] The option "option" is not valid.');
    });

    it('non valid type', () => {
        const {success, errors} = setupme.validate({option: '1'}, {option: 1});

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({
            error: 'WRONG_TYPE', key: 'option', actual: 'number', expected: 'string',
        });
        expect(console.error)
            .to.be.calledOnceWith('[setupme] The option "option" is expected to be "string" but received as "number".');
    });

    it('non valid nested option', () => {
        const {success, errors} = setupme.validate({
            a: {b: true},
        }, {
            a: {c: true},
        });

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({error: 'INVALID', key: 'a.c'});
        expect(console.error).to.be.calledOnceWith('[setupme] The option "a.c" is not valid.');
    });

    it('non valid nexted type', () => {
        const {success, errors} = setupme.validate({
            a: {b: true},
        }, {
            a: {b: function() {}},
        });

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({
            error: 'WRONG_TYPE', key: 'a.b', actual: 'function', expected: 'boolean',
        });
        expect(console.error)
            .to.be.calledOnceWith('[setupme] The option "a.b" is expected to be "boolean" but received as "function".');
    });

    it('logErrors: false', () => {
        const {success, errors} = setupme.validate({}, {option: 1}, {logErrors: false});

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({error: 'INVALID', key: 'option'});
        expect(console.error).not.to.have.been.called;
    });

    it('logName', () => {
        const logName = 'LOG_NAME';
        const {success, errors} = setupme.validate({}, {option: 1}, {logName});

        expect(success).to.be.false;
        expect(getFirst(errors)).to.deep.equal({error: 'INVALID', key: 'option'});
        expect(console.error).to.be.calledOnceWith(`[${logName}] The option "option" is not valid.`);
    });

    it('invalid setting type', () => {
        const {success} = setupme.validate({}, {}, {logErrors: 1});

        expect(success).to.be.true;
        expect(console.error)
            .to.be
            .calledOnceWith('[setupme] The option "logErrors" is expected to be "boolean" but received as "number".');
    });

    it('invalid setting option', () => {
        const {success} = setupme.validate({}, {}, {invalid: 1});

        expect(success).to.be.true;
        expect(console.error).to.be.calledOnceWith('[setupme] The option "invalid" is not valid.');
    });
});

describe('setupme objects', () => {
    it('objects', () => {
        const {success} = setupme.validate({
            obj: {},
            bool: true,
            array: [],
        }, {
            obj: {
                a: 1,
            },
            bool: false,
            array: [1, 2, 3],
        }, {
            strictly: false,
            deeply: false,
        });

        expect(success).to.be.true;
    });
});
