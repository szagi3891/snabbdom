import { observable, autorun, computed, action } from 'mobx';
import { patch, h } from './utils';

class AppState {
    @observable counter: number;
    @observable show: boolean;

    @observable input: string;
    @observable readonly list: Array<string>;

    constructor() {
        this.counter = 0;
        this.show = false;
        this.input = '';
        this.list = [];

        setInterval(() => {
            this.counter++;
        }, 5000);
    }

    toogle = () => {
        this.show = !this.show;
        console.info(this.show);
    }

    @computed get even(): boolean {
        return this.counter % 2 === 0;
    }

    @action addClick = () => {
        this.list.push(this.input);
        this.input = '';
    }

    @action onInput = (e: Event) => {
        e.stopPropagation();

        if (e.currentTarget instanceof HTMLInputElement) {
            this.input = e.currentTarget.value;
        }
    }
}

/*
    kesz funkcji jakiejśtam

    const cache = new ReactiveCache();

    cache.get(instancjaFunkcji<T>)   --->  (Args<T>) -> Return<T>

    jeśli nic nie obserwuje wartości z kesza, to element kesze powinien wygasnąć

*/

/*
const renderView = (appState: AppState) => {
    const nowyKolor = appState.show ? 'red' : 'blue';
    const nowyKolor2 = appState.even ? 'green' : 'orange';

    const listView = appState.list.map((item, index) => {
        console.info(`render item ${index}`);
        return h('div', item);
    });

    return h('div', {}, [
        h('div', { on: {click: appState.toogle} }, [
            h('span', {style: {color: nowyKolor}}, 'This is bold'),
            ` and this is just normal text ${appState.counter},`,
            h('span', {style: {color: nowyKolor2}}, `is even: ${appState.even}`)
        ]),
        h('div', { on: {click: appState.addClick} }, 'Add item'),
        h('input', {
            attrs: {
            },
            props: {
                type: 'input',
                value: appState.input
            },
            on: {
                input: appState.onInput,
            }
        }, []),
        h('span', {
            on: {
                click: appState.addClick
            },
            style: {
                cursor: 'pointer'
            }
        }, `Dodaj`),
        h('div', listView)
    ]);
};
*/

class RenderItem {
    constructor(
        readonly text: string
    ) {
    }

    @computed get vnode() {
        return h('div', this.text);
    }
}

class RenderView {
    list: Map<string, RenderItem>;

    constructor(
        readonly appState: AppState
    ) {
        this.list = new Map();
    }

    @computed get renderHeader() {
        const nowyKolor = this.appState.show ? 'red' : 'blue';
        const nowyKolor2 = this.appState.even ? 'green' : 'orange';
    
        return h('div', { on: {click: this.appState.toogle} }, [
            h('span', {style: {color: nowyKolor}}, 'This is bold'),
            ` and this is just normal text ${this.appState.counter},`,
            h('span', {style: {color: nowyKolor2}}, `is even: ${this.appState.even}`)
        ]);
    }

    @computed get renderInput() {
        return h('input', {
            attrs: {
            },
            props: {
                type: 'input',
                value: this.appState.input
            },
            on: {
                input: this.appState.onInput,
            }
        }, [])
    }

    @computed get renderButton() {
        return h('span', {
            on: {
                click: this.appState.addClick
            },
            style: {
                cursor: 'pointer'
            }
        }, `Dodaj`);
    }

    @computed get renderList() {
        const newList: Map<string, RenderItem> = new Map();

        for (const textItem of this.appState.list) {
            const oldItem = this.list.get(textItem);
            if (oldItem) {
                newList.set(textItem, oldItem);
            } else {
                newList.set(textItem, new RenderItem(textItem));
            }
        }

        this.list = newList;

        const out = [];
        for (const item of this.list.values()) {
            out.push(item.vnode);
        }
        return h('div', out);
    }

    @computed get vnode() {    
        return h('div', {}, [
            this.renderHeader,
            h('div', { on: {click: this.appState.addClick} }, 'Add item'),
            this.renderInput,
            this.renderButton,
            this.renderList
        ]);
    }
}

var container = document.getElementById('root');

if (container) {
    const appState = new AppState();

    const renderView = new RenderView(appState);
    let node = patch(container, renderView.vnode);

    let updateCounter = 0;

    autorun(() => {

        const newVnode = renderView.vnode;

        updateCounter++;
        const currentUpdateCounter = updateCounter;

        requestAnimationFrame(() => {
            if (currentUpdateCounter === updateCounter) {
                console.info('path ...');
                node = patch(node, newVnode);
            } else {
                console.info('skip path');
            }
        });
    });
}