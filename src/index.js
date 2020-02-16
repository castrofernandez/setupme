'use strict';

import compareme from 'compareme';

const INVALID = 'INVALID';
const WRONG_TYPE = 'WRONG_TYPE';

const DEFAULT_SETTINGS = {
    logErrors: true,
    logName: 'setupme',
};

const getInvalidOptions = (defaultOptions = {}, options = {}) => {
    return compareme
        .get(defaultOptions)
        .unexpected.elements.strictly.and.deeply.with(options)
        .map((diff) => ({
            error: INVALID,
            key: diff.index,
        }));
};

const getWrongTypeOptions = (defaultOptions = {}, options = {}) => {
    return compareme
        .get(defaultOptions)
        .type.differences.strictly.and.deeply.with(options)
        .map((diff) => ({
            error: WRONG_TYPE,
            key: diff.index,
            expected: diff.first,
            actual: diff.second,
        }));
};

const getErrors = (defaultOptions = {}, options = {}) => [
    ...getWrongTypeOptions(defaultOptions, options),
    ...getInvalidOptions(defaultOptions, options),
];

const getResultData = (errors = []) => ({
    success: errors.length === 0,
    errors,
});

const doLogErrors = (defaultOptions, options, logName) => {
    getWrongTypeOptions(defaultOptions, options).forEach((diff) => {
        console.error(`[${logName}] The option "${diff.key}" is expected to be ` +
            `"${diff.expected}" but received as "${diff.actual}".`);
    });

    getInvalidOptions(defaultOptions, options).forEach((diff) => {
        console.error(`[${logName}] The option "${diff.key}" is not valid.`);
    });
};

const getSettings = (defaultOptions = {}, options = {}) => Object.assign({}, defaultOptions, options);

const logErrorsIfRequested = (defaultOptions = {}, options = {}, {
    logErrors = DEFAULT_SETTINGS.logErrors,
    logName = DEFAULT_SETTINGS.logName,
}) => logErrors ? doLogErrors(defaultOptions, options, logName) : false;

const printErrorsOfSetupMeSettings = (settings) => doLogErrors(DEFAULT_SETTINGS, settings, DEFAULT_SETTINGS.logName);

const validate = (defaultOptions = {}, options = {}, settings = {}) => {
    printErrorsOfSetupMeSettings(settings);
    logErrorsIfRequested(defaultOptions, options, getSettings(settings));

    return getResultData(getErrors(defaultOptions, options));
};

export default {
    validate,
};
