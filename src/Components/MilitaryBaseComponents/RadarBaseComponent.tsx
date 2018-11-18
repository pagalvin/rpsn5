import React, { Component } from 'react';
import { RadarBase } from '../../Entities/WorldObjects/Bases/RadarBase';
import { Button } from '@material-ui/core';

interface props {
    base: RadarBase
}

interface state {
}

export class RadarBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }

    componentDidMount() {

        console.log(`RadarBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    render() {

        const setMode = (args: { mode: "Active" | "Passive" }) => {
            this.props.base.setModeOfOperation(args);
            this.forceUpdate();
        }

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => setMode({ mode: "Active" })}>Go Active</Button>
                <Button onClick={() => setMode({ mode: "Passive" })}>Go Passive</Button>
            </React.Fragment>;

        const isActivatedMarkup =
            <React.Fragment>
                <span>Mode: {this.props.base.modeOfOperaton} Tracking</span>
            </React.Fragment>

        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Warming up...</span>
            </React.Fragment>;

        const wrapper = (toWrap: JSX.Element) => {
            return (
                <div>
                    <span>{`${this.props.base.WorldObjectLabel}: ${this.props.base.Name}`}</span>
                    {toWrap}
                </div>
            )
        };


        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.modeOfOperaton === "Inactive" ? wrapper(readyToActivateMarkup) : wrapper(isActivatedMarkup)
                )
                : wrapper(isNotReceivingOrdersMarkup)
        );
    };

}
