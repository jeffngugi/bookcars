import React, { Component } from 'react';
import Master from '../elements/Master';
import { strings as commonStrings } from '../lang/common';
import { strings } from '../lang/change-password';
import UserService from '../services/UserService';
import Backdrop from '../elements/SimpleBackdrop';
import NoMatch from './NoMatch';
import Error from './Error';
import {
    Paper,
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Button
} from '@mui/material';
import Helper from '../common/Helper';

import '../assets/css/change-password.css';

export default class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userId: '',
            newPassword: '',
            confirmPassword: '',
            newPasswordError: false,
            confirmPasswordError: false,
            passwordLengthError: false,
            error: false,
            loading: false,
            noMatch: false,
            currentPassword: '',
            currentPasswordError: false,
        };
    }

    handleNewPasswordChange = (e) => {
        this.setState({ newPassword: e.target.value });
    };

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirmPassword: e.target.value });
    };

    handleOnConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    };

    handleCurrentPasswordChange = (e) => {
        this.setState({ currentPassword: e.target.value });
    };

    error = () => {
        Helper.error(null, strings.PASSWORD_UPDATE_ERROR);
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const submit = () => {

            if (this.state.newPassword.length < 6) {
                return this.setState({
                    passwordLengthError: true,
                    confirmPasswordError: false,
                    newPasswordError: false
                });
            } else {
                this.setState({
                    passwordLengthError: false,
                    newPasswordError: false
                });
            }

            if (this.state.newPassword !== this.state.confirmPassword) {
                return this.setState({
                    confirmPasswordError: true,
                    newPasswordError: false
                });
            } else {
                this.setState({
                    confirmPasswordError: false,
                    newPasswordError: false
                });
            }

            const { user, currentPassword, newPassword } = this.state;

            const data = {
                _id: user._id,
                password: currentPassword,
                newPassword,
                strict: true
            };

            UserService.changePassword(data)
                .then(status => {
                    if (status === 200) {
                        UserService.getUser(user._id)
                            .then(_user => {
                                if (_user) {
                                    this.setState({ user: _user, newPasswordError: false, currentPassword: '', newPassword: '', confirmPassword: '' });
                                    Helper.info(strings.PASSWORD_UPDATE);
                                } else {
                                    this.error();
                                }
                            })
                            .catch(() => {
                                UserService.signout();
                            });
                    } else {
                        this.error();
                    }
                })
                .catch(() => {
                    UserService.signout();
                });
        };

        const { user, currentPassword } = this.state;

        UserService.checkPassword(user._id, currentPassword)
            .then((status) => {
                this.setState({
                    currentPasswordError: status !== 200,
                    newPasswordError: false,
                    passwordLengthError: false,
                    confirmPasswordError: false
                });

                if (status === 200) {
                    submit();
                }
            })
            .catch(() => UserService.signout());

    };

    onLoad = (user) => {
        this.setState({ user, loading: false, visible: true });
    }

    componentDidMount() {
        this.setState({ loading: true, visible: false });
    }

    render() {
        const { visible, currentPassword, newPassword, confirmPassword,
            currentPasswordError, newPasswordError, confirmPasswordError,
            passwordLengthError, loading, error, noMatch } = this.state;

        return (
            <Master onLoad={this.onLoad} strict={true}>
                <div className="password-reset" style={visible ? null : { display: 'none' }}>
                    <Paper className="password-reset-form password-reset-form-wrapper" elevation={10}>
                        <h1 className="password-reset-form-title"> {strings.CHANGE_PASSWORD_HEADING} </h1>
                        <form className="form" onSubmit={this.handleSubmit}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel
                                    error={currentPasswordError}
                                    className='required'
                                >
                                    {strings.CURRENT_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-current"
                                    onChange={this.handleCurrentPasswordChange}
                                    value={currentPassword}
                                    error={currentPasswordError}
                                    type='password'
                                    required
                                />
                                <FormHelperText
                                    error={currentPasswordError}
                                >
                                    {(currentPasswordError && strings.CURRENT_PASSWORD_ERROR) || ''}
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                fullWidth
                                margin="dense"
                            >
                                <InputLabel className='required' error={newPasswordError}>
                                    {strings.NEW_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-new"
                                    onChange={this.handleNewPasswordChange}
                                    type='password'
                                    value={newPassword}
                                    error={newPasswordError || passwordLengthError}
                                    required
                                />
                                <FormHelperText
                                    error={newPasswordError || passwordLengthError}
                                >
                                    {
                                        ((newPasswordError && strings.NEW_PASSWORD_ERROR) || '')
                                        || (passwordLengthError ? commonStrings.PASSWORD_ERROR : '')
                                    }
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                fullWidth
                                margin="dense"
                                error={confirmPasswordError}
                            >
                                <InputLabel
                                    error={confirmPasswordError}
                                    className='required'
                                >
                                    {commonStrings.CONFIRM_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-confirm"
                                    onChange={this.handleConfirmPasswordChange}
                                    onKeyDown={this.handleOnConfirmPasswordKeyDown}
                                    error={confirmPasswordError}
                                    type='password'
                                    value={confirmPassword}
                                    required
                                />
                                <FormHelperText
                                    error={confirmPasswordError}
                                >
                                    {confirmPasswordError && commonStrings.PASSWORDS_DONT_MATCH}
                                </FormHelperText>
                            </FormControl>
                            <div className='buttons'>
                                <Button
                                    type="submit"
                                    className='btn-primary btn-margin btn-margin-bottom'
                                    size="small"
                                    variant='contained'
                                >
                                    {commonStrings.RESET_PASSWORD}
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
                    </Paper>
                </div>
                {loading && <Backdrop text={commonStrings.PLEASE_WAIT} />}
                {error && <Error />}
                {noMatch && <NoMatch hideHeader />}
            </Master>
        );
    }
}