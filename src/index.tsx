import { observable, autorun, computed } from 'mobx';

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

class AppState {
    @observable counter: number;
    @observable show: boolean;

    constructor() {
        this.counter = 0;
        this.show = false;

        setInterval(() => {
            this.counter++;
        }, 1000);
    }

    toogle = () => {
        this.show = !this.show;
        console.info(this.show);
    }

    @computed get even(): boolean {
        return this.counter % 2 === 0;
    }
}

const renderView = (appState: AppState) => {

    const nowyKolor = appState.show ? 'red' : 'blue';
    const nowyKolor2 = appState.even ? 'green' : 'orange';

    console.info({
        'Nowy kolor': nowyKolor,
        'appState.even': appState.even
    });

    return h('div', {on: {click: appState.toogle}}, [
        h('span', {style: {color: nowyKolor}}, 'This is bold'),
        ` and this is just normal text ${appState.counter},`,
        h('span', {style: {color: nowyKolor2}}, `is even: ${appState.even}`)
    ]);
};


var container = document.getElementById('root');

if (container) {
    const appState = new AppState();

    const vnode = renderView(appState);
    let node = patch(container, vnode);

    autorun(() => {
        const newVnode = renderView(appState);
        console.info('path ...');
        node = patch(node, newVnode);
    });
}