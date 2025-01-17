import React, { Component } from 'react';
import Env from '../config/env.config';
import { strings as commonStrings } from '../lang/common';
import { strings as clStrings } from '../lang/company-list';
import CompanyService from '../services/CompanyService';
import Helper from '../common/Helper';
import Master from '../elements/Master';
import Backdrop from '../elements/SimpleBackdrop';
import { Avatar } from '../elements/Avatar';
import CarList from '../elements/CarList';
import InfoBox from '../elements/InfoBox';
import Error from './Error';
import NoMatch from './NoMatch';
import {
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

import '../assets/css/company.css';

export default class Company extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            company: null,
            error: false,
            visible: false,
            loading: false,
            noMatch: false,
            openDeleteDialog: false,
            rowCount: -1,
            offset: 0
        };
    }

    onBeforeUpload = () => {
        this.setState({ loading: true });
    };

    onAvatarChange = (avatar) => {
        const { user, company } = this.state;

        if (user._id === company._id) {
            const _user = Helper.clone(user);
            _user.avatar = avatar;
            this.setState({ user: _user });
        }
        this.setState({ loading: false });
    };

    handleDelete = () => {
        this.setState({ openDeleteDialog: true });
    };

    handleConfirmDelete = () => {
        const { company } = this.state;

        this.setState({ loading: true, openDeleteDialog: false }, () => {
            CompanyService.delete(company._id).then(status => {
                if (status === 200) {
                    window.location.href = '/suppliers';
                } else {
                    Helper.error();
                    this.setState({ loading: false });
                }
            }).catch((err) => {
                Helper.error(err);
                this.setState({ loading: false });
            });
        });
    };

    handleCancelDelete = () => {
        this.setState({ openDeleteDialog: false });
    };

    handleCarListLoad = (data) => {
        this.setState({ rowCount: data.rowCount });
    };

    handleCarDelete = (rowCount) => {
        this.setState({ rowCount });
    };

    onLoad = (user) => {
        this.setState({ user, loading: true }, () => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('c')) {
                const id = params.get('c');
                if (id && id !== '') {
                    CompanyService.getCompany(id)
                        .then(company => {
                            if (company) {
                                this.setState({
                                    company,
                                    fullName: company.fullName,
                                    phone: company.phone,
                                    location: company.location,
                                    bio: company.bio,
                                    visible: true,
                                    loading: false
                                }, () => {
                                    this.setState({ offset: document.querySelector('div.col-1').clientHeight });
                                });
                            } else {
                                this.setState({ loading: false, noMatch: true });
                            }
                        })
                        .catch(() => {
                            this.setState({ loading: false, error: true, visible: false });
                        });
                } else {
                    this.setState({ loading: false, noMatch: true });
                }
            } else {
                this.setState({ loading: false, noMatch: true });
            }
        });
    };

    render() {
        const { visible, loading, error, noMatch, user, company, openDeleteDialog, rowCount, offset } = this.state;
        const edit = (user && company) && (user.type === Env.RECORD_TYPE.ADMIN || user._id === company._id);

        return (
            <Master onLoad={this.onLoad} user={user} strict={true}>
                {visible && company &&
                    <div className='company'>
                        <div className='col-1'>
                            <section className='company-avatar-sec'>
                                {edit ? (<Avatar
                                    record={company}
                                    type={Env.RECORD_TYPE.COMPANY}
                                    mode='update'
                                    size='large'
                                    hideDelete
                                    onBeforeUpload={this.onBeforeUpload}
                                    onChange={this.onAvatarChange}
                                    readonly={!edit}
                                    color='disabled'
                                    className='company-avatar' />)
                                    :
                                    <div className='car-company'>
                                        <span className='car-company-logo'>
                                            <img src={Helper.joinURL(Env.CDN_USERS, company.avatar)}
                                                alt={company.fullName}
                                                style={{ width: Env.COMPANY_IMAGE_WIDTH }}
                                            />
                                        </span>
                                        <span className='car-company-info'>
                                            {company.fullName}
                                        </span>
                                    </div>
                                }
                            </section>
                            {edit && <Typography variant="h4" className="company-name">{company.fullName}</Typography>}
                            {company.bio && company.bio !== '' && <Typography variant="h6" className="company-info">{company.bio}</Typography>}
                            {company.location && company.location !== '' && <Typography variant="h6" className="company-info">{company.location}</Typography>}
                            {company.phone && company.phone !== '' && <Typography variant="h6" className="company-info">{company.phone}</Typography>}
                            <div className="company-actions">

                                {edit &&
                                    <Tooltip title={commonStrings.UPDATE}>
                                        <IconButton href={`/update-company?c=${company._id}`}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {edit &&
                                    <Tooltip title={commonStrings.DELETE}>
                                        <IconButton data-id={company._id} onClick={this.handleDelete}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                            {rowCount > 0 &&
                                <InfoBox value={`${rowCount} ${commonStrings.CAR}${rowCount > 1 ? 's' : ''}`} className='car-count' />
                            }
                        </div>
                        <div className='col-2'>
                            <CarList
                                containerClassName={Env.isMobile() ? 'company' : null}
                                offset={offset}
                                user={user}
                                companies={[company._id]}
                                keyword=''
                                reload={false}
                                onLoad={this.handleCarListLoad}
                                onDelete={this.handleCarDelete}
                                hideCompany
                            />
                        </div>
                    </div>
                }
                <Dialog
                    disableEscapeKeyDown
                    maxWidth="xs"
                    open={openDeleteDialog}
                >
                    <DialogTitle className='dialog-header'>{commonStrings.CONFIRM_TITLE}</DialogTitle>
                    <DialogContent>{clStrings.DELETE_COMPANY}</DialogContent>
                    <DialogActions className='dialog-actions'>
                        <Button onClick={this.handleCancelDelete} variant='contained' className='btn-secondary'>{commonStrings.CANCEL}</Button>
                        <Button onClick={this.handleConfirmDelete} variant='contained' color='error'>{commonStrings.DELETE}</Button>
                    </DialogActions>
                </Dialog>
                {loading && <Backdrop text={commonStrings.LOADING} />}
                {error && <Error />}
                {noMatch && <NoMatch hideHeader />}
            </Master>
        );
    }
}