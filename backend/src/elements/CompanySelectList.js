import React, { Component } from 'react';
import Env from '../config/env.config';
import CompanyService from '../services/CompanyService';
import Helper from '../common/Helper';
import MultipleSelect from './MultipleSelect';
import UserService from '../services/UserService';

class CompanySelectList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            init: false,
            loading: false,
            rows: [],
            fetch: false,
            page: 1,
            keyword: '',
            selectedOptions: [],
            rowCount: 0
        }
    }

    getCompanies = (companies) => companies.map(company => {
        const { _id, fullName, avatar } = company;
        return { _id, name: fullName, image: avatar };
    });

    fetch = (onFetch) => {
        const { rows, keyword, page } = this.state;
        this.setState({ loading: true });

        CompanyService.getCompanies(keyword, page, Env.PAGE_SIZE)
            .then(data => {
                const _data = data.length > 0 ? data[0] : {};
                if (_data.length === 0) _data.resultData = [];
                const totalRecords = _data.pageInfo.length > 0 ? _data.pageInfo[0].totalRecords : 0;
                const _rows = page === 1 ? this.getCompanies(_data.resultData) : [...rows, ...this.getCompanies(_data.resultData)];
                this.setState({ rows: _rows, loading: false, fetch: _data.resultData.length > 0 }, () => {
                    if (onFetch) {
                        onFetch({ rows: _data.resultData, rowCount: totalRecords });
                    }
                });
            })
            .catch(() => UserService.signout());
    };

    handleChange = (values, key, reference) => {
        if (this.props.onChange) {
            this.props.onChange(values);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const { selectedOptions } = prevState;

        const _value = nextProps.multiple ? nextProps.value : [nextProps.value];
        if (nextProps.value && !Helper.arrayEqual(selectedOptions, _value)) {
            return { selectedOptions: _value };
        }

        return null;
    }

    render() {
        const { init,
            loading,
            rows,
            fetch,
            page,
            keyword,
            selectedOptions } = this.state;
        return (
            <MultipleSelect
                loading={loading}
                label={this.props.label || ''}
                callbackFromMultipleSelect={this.handleChange}
                options={rows}
                selectedOptions={selectedOptions}
                required={this.props.required || false}
                multiple={this.props.multiple}
                type={Env.RECORD_TYPE.COMPANY}
                variant={this.props.variant || 'standard'}
                ListboxProps={{
                    onScroll: (event) => {
                        const listboxNode = event.currentTarget;
                        if (fetch && !loading && (listboxNode.scrollTop + listboxNode.clientHeight >= (listboxNode.scrollHeight - Env.PAGE_OFFSET))) {
                            const p = page + 1;
                            this.setState({ page: p }, () => {
                                this.fetch();
                            });
                        }
                    }
                }}
                onFocus={
                    (event) => {
                        if (!init) {
                            const p = 1;
                            this.setState({ rows: [], page: p }, () => {
                                this.fetch(() => { this.setState({ init: true }) });
                            });
                        }
                    }
                }
                onInputChange={
                    (event) => {
                        const value = (event && event.target ? event.target.value : null) || '';

                        //if (event.target.type === 'text' && value !== keyword) {
                        if (value !== keyword) {
                            this.setState({ rows: [], page: 1, keyword: value }, () => {
                                this.fetch();
                            });
                        }
                    }
                }
                onClear={
                    (event) => {
                        this.setState({ rows: [], page: 1, keyword: '', fetch: true }, () => {
                            this.fetch();
                        });
                    }
                }
            />
        );
    }
}

export default CompanySelectList;