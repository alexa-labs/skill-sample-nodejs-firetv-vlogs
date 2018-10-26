'use strict';

const MAPPING = {
    first : 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    // add localized Mappings here too
}

const ordinalToNumber = (slotValue) => {
    if(Object.hasOwnProperty.call(MAPPING, slotValue)) {
        return MAPPING[slotValue];
    }

    return parseInt(slotValue, 10);
}

module.exports = {
    ordinalToNumber
}