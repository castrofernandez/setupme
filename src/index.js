'use strict';

import compareme from 'compareme';

const INVALID = 'INVALID';
const WRONG_TYPE = 'WRONG_TYPE';

const DEFAULT_SETTINGS = {
    logErrors: true,
    logName: 'setupme',
    strictly: true,
    deeply: true,
};

const DEFAULT_MODE_HANDLER = (comparer) => comparer;

const MODE_HANDER = [
    {
        applies: ({strictly, deeply}) => strictly === true && deeply === true,
        get: (comparer) => comparer.strictly.and.deeply,
    },
    {
        applies: ({strictly, deeply}) => strictly === true && deeply === false,
        get: (comparer) => comparer.strictly,
    },
    {
        applies: ({strictly, deeply}) => strictly === false && deeply === true,
        get: (comparer) => comparer.deeply,
    },
    {
        applies: ({strictly, deeply}) => strictly === false && deeply === false,
        get: DEFAULT_MODE_HANDLER,
    },
];

const findModeHandler = (conditions) => MODE_HANDER.find(({applies}) => applies(conditions));

const getModeHandler = (conditions) => findModeHandler(conditions) || {get: DEFAULT_MODE_HANDLER};

const getComparer = ({strictly = true, deeply = true}) => getModeHandler({strictly, deeply}).get;

const getInvalidOptions = (defaultOptions = {}, options = {}, settings = {}) => {
    return getComparer(settings)(compareme.get(defaultOptions).unexpected.elements)
        .with(options)
        .map((diff) => ({
            error: INVALID,
            key: diff.index,
        }));
};

const getWrongTypeOptions = (defaultOptions = {}, options = {}, settings = {}) => {
    return getComparer(settings)(compareme.get(defaultOptions).type.differences)
        .with(options)
        .map((diff) => ({
            error: WRONG_TYPE,
            key: diff.index,
            expected: diff.first,
            actual: diff.second,
        }));
};

const getErrors = (defaultOptions = {}, options = {}, settings = {}) => [
    ...getWrongTypeOptions(defaultOptions, options, settings),
    ...getInvalidOptions(defaultOptions, options, settings),
];

const getResultData = (errors = []) => ({
    success: errors.length === 0,
    errors,
});

const doLogErrors = (defaultOptions, options, settings = {}) => {
    const {logName} = settings;

    getWrongTypeOptions(defaultOptions, options, settings).forEach((diff) => {
        console.error(`[${logName}] The option "${diff.key}" is expected to be ` +
            `"${diff.expected}" but received as "${diff.actual}".`);
    });

    getInvalidOptions(defaultOptions, options, settings).forEach((diff) => {
        console.error(`[${logName}] The option "${diff.key}" is not valid.`);
    });
};

const getSettings = (defaultOptions = {}, options = {}) => Object.assign({}, defaultOptions, options);

const logErrorsIfRequested = (defaultOptions = {}, options = {}, settings = {}) => {
    const {logErrors} = settings;
    return logErrors ? doLogErrors(defaultOptions, options, settings) : false;
};

const printErrorsOfSetupMeSettings = (settings) => doLogErrors(DEFAULT_SETTINGS, settings, DEFAULT_SETTINGS);

const doValidate = (defaultOptions = {}, options = {}, settings = {}) => {
    logErrorsIfRequested(defaultOptions, options, settings);
    return getResultData(getErrors(defaultOptions, options, settings));
};

const validate = (defaultOptions = {}, options = {}, settings = {}) => {
    printErrorsOfSetupMeSettings(settings);
    return doValidate(defaultOptions, options, getSettings(DEFAULT_SETTINGS, settings));
};

export default {
    validate,
};
