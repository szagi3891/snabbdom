
import * as snabbdom from 'snabbdom';

import snabbdomClass from 'snabbdom/modules/class';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomStyle from 'snabbdom/modules/style';
import snabbdomEventlisteners from 'snabbdom/modules/eventlisteners';
import h from 'snabbdom/h';

var patch = snabbdom.init([
    snabbdomClass,
    snabbdomProps,
    snabbdomStyle,
    snabbdomEventlisteners,
]);

export { h, patch };