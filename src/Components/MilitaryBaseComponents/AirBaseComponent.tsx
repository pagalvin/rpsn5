import React, { Component } from 'react';
import { AirBase } from '../../Entities/WorldObjects/Bases/AirBase';
import { Button } from '@material-ui/core';
import { GameLogic } from '../../Game/GameLogic';
import { OrdnanceTargetingComponent } from '../OrdnanceTargetingComponent';

interface props {
    base: AirBase;
}

interface state {
    isTargetingBombers: boolean;
}

export class AirBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isTargetingBombers: false
        }

    }


    componentDidMount() {

        console.log(`AirBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private activateAirBase() {
        console.log(`AirbaseComponent: activateAirBase: entering.`);
        GameLogic.activateAirBase({ forBase: this.props.base });
        this.setState({ isTargetingBombers: true });
    }

    private handleAllOrdnanceTargeted() {
        this.setState({
            isTargetingBombers: false
        })
    }

    render() {

        console.log(`AirBaseComponent: render: entering with state and props:`, { state: this.state, props: this.props });

        const isTargetingMarkup =
            <React.Fragment>
                <span>{`Targeting ${this.props.base.ordnance.length} bombers.`}<br /></span>
                <OrdnanceTargetingComponent
                    ordnanceLabel={"Bomber"}
                    parentBase={this.props.base}
                    targetingCompleteCallback={() => this.setState({ isTargetingBombers: false })}
                />
            </React.Fragment>;

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateAirBase()}>
                    {`Scramble ${this.props.base.totalFighters} fighters and ${this.props.base.ordnance.length} bombers.`}
                </Button>
            </React.Fragment>;

        const isFlyingMarkup =
            <React.Fragment>
                <span>
                    {
                        `${this.props.base.totalFighters} on patrol. ${this.props.base.ordnance.length} bombers en route to their target.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Flight crews prepping...</span>
            </React.Fragment>;

        const wrapper = (toWrap: JSX.Element) => {
            return (
                <div>
                    <span>{`${this.props.base.WorldObjectLabel}: ${this.props.base.Name}`}</span>
                    {toWrap}
                </div>
            )
        };

        if (this.state.isTargetingBombers) { return wrapper(isTargetingMarkup); }
        if (!this.props.base.isReceivingOrders) { return wrapper(isNotReceivingOrdersMarkup); }
        if (this.props.base.isAllOrdnanceTargeted()) { return wrapper(isFlyingMarkup); }

        return wrapper(readyToActivateMarkup);

    };

}
