import axios from 'axios';
import Env from '../config/env.config';
import UserService from './UserService';

export default class CompanyService {

    static validate(data) {
        return axios.post(`${Env.API_HOST}/api/validate-company`, data, { headers: UserService.authHeader() }).then(res => res.status);
    }

    static update(data) {
        return axios.put(`${Env.API_HOST}/api/update-company`, data, { headers: UserService.authHeader() }).then(res => res.status);
    }

    static delete(id) {
        return axios.delete(`${Env.API_HOST}/api/delete-company/${encodeURIComponent(id)}`, { headers: UserService.authHeader() }).then(res => res.status);
    }

    static getCompany(id) {
        return axios.get(`${Env.API_HOST}/api/company/${encodeURIComponent(id)}`, { headers: UserService.authHeader() }).then(res => res.data);
    }

    static getCompanies(keyword, page, size) {
        return axios.get(`${Env.API_HOST}/api/companies/${page}/${size}/?s=${encodeURIComponent(keyword)}`, { headers: UserService.authHeader() }).then(res => res.data);
    }

    static getAllCompanies() {
        return axios.get(`${Env.API_HOST}/api/all-companies`, { headers: UserService.authHeader() }).then(res => res.data);
    }

}