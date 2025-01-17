import React, { Component } from 'react';
import Env from '../config/env.config';
import { strings as commonStrings } from '../lang/common';
import { strings } from "../lang/cars";
import Accordion from './Accordion';

import '../assets/css/gearbox-filter.css'

class GearboxFilter extends Component {

    automaticRef = null;
    manualRef = null;

    constructor(props) {
        super(props);

        this.state = {
            allChecked: true,
            values: [Env.GEARBOX_TYPE.AUTOMATIC, Env.GEARBOX_TYPE.MANUAL]
        }
    }

    handleCheckAutomaticChange = (e) => {
        const { values } = this.state;

        if (e.currentTarget.checked) {
            values.push(Env.GEARBOX_TYPE.AUTOMATIC);

            if (values.length === 2) {
                this.setState({ allChecked: true });
            }
        } else {
            values.splice(values.findIndex(v => v === Env.GEARBOX_TYPE.AUTOMATIC), 1);

            if (values.length === 0) {
                this.setState({ allChecked: false });
            }
        }

        this.setState({ values }, () => {
            if (this.props.onChange) {
                this.props.onChange(values);
            }
        });
    };

    handleAutomaticClick = (e) => {
        const checkbox = e.currentTarget.previousSibling;
        checkbox.checked = !checkbox.checked;
        const event = e;
        event.currentTarget = checkbox;
        this.handleCheckAutomaticChange(event);
    };

    handleCheckManualChange = (e) => {
        const { values } = this.state;

        if (e.currentTarget.checked) {
            values.push(Env.GEARBOX_TYPE.MANUAL);

            if (values.length === 2) {
                this.setState({ allChecked: true });
            }
        } else {
            values.splice(values.findIndex(v => v === Env.GEARBOX_TYPE.MANUAL), 1);

            if (values.length === 0) {
                this.setState({ allChecked: false });
            }
        }

        this.setState({ values }, () => {
            if (this.props.onChange) {
                this.props.onChange(values);
            }
        });
    };

    handleManualClick = (e) => {
        const checkbox = e.currentTarget.previousSibling;
        checkbox.checked = !checkbox.checked;
        const event = e;
        event.currentTarget = checkbox;
        this.handleCheckManualChange(event);
    };

    handleUncheckAllChange = (e) => {
        const { allChecked } = this.state;

        if (allChecked) { // uncheck all
            this.automaticRef.checked = false;
            this.manualRef.checked = false;

            this.setState({ allChecked: false, values: [] });
        } else { // check all
            this.automaticRef.checked = true;
            this.manualRef.checked = true;

            const values = [Env.GEARBOX_TYPE.AUTOMATIC, Env.GEARBOX_TYPE.MANUAL];

            this.setState({ allChecked: true, values }, () => {
                if (this.props.onChange) {
                    this.props.onChange(values);
                }
            });
        }
    };

    componentDidMount() {
        const { allChecked } = this.state;

        if (allChecked) {
            this.automaticRef.checked = true;
            this.manualRef.checked = true;
        }
    }

    render() {
        const { allChecked } = this.state;

        return (
            <Accordion title={strings.GEARBOX} className={`${this.props.className ? `${this.props.className} ` : ''}gearbox-filter`}>
                <div className='filter-elements'>
                    <div className='filter-element'>
                        <input ref={ref => this.automaticRef = ref} type='checkbox' className='gearbox-checkbox' onChange={this.handleCheckAutomaticChange} />
                        <label onClick={this.handleAutomaticClick}>{strings.GEARBOX_AUTOMATIC}</label>
                    </div>
                    <div className='filter-element'>
                        <input ref={ref => this.manualRef = ref} type='checkbox' className='gearbox-checkbox' onChange={this.handleCheckManualChange} />
                        <label onClick={this.handleManualClick}>{strings.GEARBOX_MANUAL}</label>
                    </div>
                </div>
                <div className='filter-actions'>
                    <span onClick={this.handleUncheckAllChange} className='uncheckall'>
                        {allChecked ? commonStrings.UNCHECK_ALL : commonStrings.CHECK_ALL}
                    </span>
                </div>
            </Accordion>
        );
    }
}

export default GearboxFilter;