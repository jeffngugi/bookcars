import React, { Component } from 'react';
import Env from '../config/env.config';
import UserService from '../services/UserService';
import Master from '../elements/Master';
import { strings as commonStrings } from '../lang/common';
import { strings } from '../lang/reset-password';
import NoMatch from './NoMatch';
import {
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Button,
    Paper,
    Link
} from '@mui/material';
import validator from 'validator';
import Helper from '../common/Helper';

import '../assets/css/reset-password.css';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            visible: false,
            error: false,
            emailValid: true,
            noMatch: false,
            sent: false
        };
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });

        if (!e.target.value) {
            this.setState({ error: false, emailValid: true });
        }
    };

    handleEmailKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    }

    validateEmail = async (email) => {
        if (email) {
            if (validator.isEmail(email)) {
                try {
                    const status = await UserService.validateEmail({ email });

                    if (status === 200) { // user not found (error)
                        this.setState({ error: true, emailValid: true });
                        return false;
                    } else {
                        this.setState({ error: false, emailValid: true });
                        return true;
                    }
                } catch (err) {
                    Helper.error(err);
                    this.setState({ error: false, emailValid: true });
                    return false;
                }
            } else {
                this.setState({ error: false, emailValid: false });
                return false;
            }
        } else {
            this.setState({ error: false, emailValid: true });
            return false;
        }
    };

    handleEmailBlur = async (e) => {
        await this.validateEmail(e.target.value);
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { email } = this.state;

        const emailValid = await this.validateEmail(email);
        if (!emailValid) {
            return;
        }

        UserService.resend(email, true, Env.APP_TYPE)
            .then(status => {
                if (status === 200) {
                    this.setState({ error: false, emailValid: true, sent: true });
                } else {
                    this.setState({ error: true, emailValid: true });
                }
            })
            .catch(() => {
                this.setState({ error: true, emailValid: true });
            });
    };

    onLoad = (user) => {
        if (user) {
            this.setState({ noMatch: true });
        } else {
            this.setState({ visible: true });
        }
    }

    componentDidMount() {
    }

    render() {
        const {
            visible,
            emailValid,
            error,
            noMatch,
            sent
        } = this.state;

        return (
            <Master onLoad={this.onLoad} strict={false}>
                {visible &&
                    <div className="reset-password">
                        <Paper className="reset-password-form" elevation={10}>
                            <h1 className='reset-password-title'> {strings.RESET_PASSWORD_HEADING} </h1>
                            {sent &&
                                <div>
                                    <label>{strings.EMAIL_SENT}</label>
                                    <p><Link href='/'>{commonStrings.GO_TO_HOME}</Link></p>
                                </div>}
                            {!sent &&
                                <form onSubmit={this.handleSubmit}>
                                    <label>{strings.RESET_PASSWORD}</label>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel className='required'>
                                            {commonStrings.EMAIL}
                                        </InputLabel>
                                        <Input
                                            onChange={this.handleEmailChange}
                                            onKeyDown={this.handleEmailKeyDown}
                                            onBlur={this.handleEmailBlur}
                                            type='text'
                                            error={error || !emailValid}
                                            autoComplete='off'
                                            required
                                        />
                                        <FormHelperText error={error || !emailValid}>
                                            {(!emailValid && commonStrings.EMAIL_NOT_VALID) || ''}
                                            {(error && strings.EMAIL_ERROR) || ''}
                                        </FormHelperText>
                                    </FormControl>

                                    <div className='buttons'>
                                        <Button
                                            type="submit"
                                            className='btn-primary btn-margin btn-margin-bottom'
                                            size="small"
                                            variant='contained'
                                        >
                                            {strings.RESET}
                                        </Button>
                                        <Button
                                            className='btn-secondary btn-margin-bottom'
                                            size="small"
                                            variant='contained'
                                            href="/"
                                        >
                                            {commonStrings.CANCEL}
                                        </Button>
                                    </div>
                                </form>
                            }
                        </Paper>
                    </div>
                }
                {noMatch && <NoMatch hideHeader />}
            </Master >
        );
    }
}