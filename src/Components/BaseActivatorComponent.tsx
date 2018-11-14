import React, { Component, SyntheticEvent } from 'react';

interface props {
}

interface buildSelection {
}

interface state {
}

export class BaseActivatorComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }

    componentDidMount() {

        console.log(`BaseActivatorComponent: componentDidMount: state and props:`, { state: this.state, props: this.props});

    }

    render() {

        console.log(`BaseActivatorComponent: render: Entering with props and state:`, {props: this.props, state: this.state});

        const toRender = (
            <React.Fragment>
                <div> Base activator component! </div>
            </React.Fragment>
        )

        return toRender;
    }
}
