import React, { Component } from 'react';
import Env from '../config/env.config';
import BookingService from '../services/BookingService';
import { strings as commonStrings } from '../lang/common';
import { strings as csStrings } from '../lang/cars';
import { strings } from '../lang/create-booking';
import Helper from '../common/Helper';
import UserService from '../services/UserService';
import CarService from '../services/CarService';
import LocationService from '../services/LocationService';
import Master from '../elements/Master';
import Error from '../elements/Error';
import DatePicker from '../elements/DatePicker';
import Backdrop from '../elements/SimpleBackdrop';
import NoMatch from './NoMatch';
import Info from './Info';
import {
    OutlinedInput,
    InputLabel,
    FormControl,
    FormHelperText,
    Button,
    Paper,
    Checkbox,
    Link,
    FormControlLabel,
    Switch,
    RadioGroup,
    Radio
} from '@mui/material';
import {
    DirectionsCar as CarIcon,
    Lock as LockIcon,
    Person as DriverIcon,
    EventSeat as BookingIcon,
    Settings as PaymentOptionsIcon
} from '@mui/icons-material';
import validator from 'validator';
import { format, intervalToDuration } from 'date-fns';
import { fr, enUS } from "date-fns/locale";

import SecurePayment from '../assets/img/secure-payment.png';
import '../assets/css/create-booking.css';

export default class CreateBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            authenticated: false,
            language: Env.DEFAULT_LANGUAGE,
            noMatch: false,
            fullName: '',
            email: '',
            phone: '',
            birthDate: null,
            emailValid: true,
            emailRegitered: false,
            phoneValid: true,
            tosChecked: false,
            tosError: false,
            error: false,
            cardName: '',
            cardNumber: '',
            cardNumberValid: true,
            cardMonth: '',
            cardMonthValid: true,
            cardYear: '',
            cardYearValid: true,
            cvv: '',
            cvvValid: true,
            price: 0,
            emailInfo: true,
            phoneInfo: true,
            cancellation: false,
            amendments: false,
            theftProtection: false,
            collisionDamageWaiver: false,
            fullInsurance: false,
            additionalDriver: false,
            cardDateError: false,
            success: false,
            loading: false,
            birthDateValid: true,
            _fullName: '',
            _email: '',
            _phone: '',
            _birthDate: null,
            _emailValid: true,
            _phoneValid: true,
            _birthDateValid: true,
            payLater: false
        };
    }

    handleCancellationChange = (e) => {
        const cancellation = e.target.checked;
        const { car, from, to, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ cancellation, price });
    };

    handleAmendmentsChange = (e) => {
        const amendments = e.target.checked;
        const { car, from, to, cancellation, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ amendments, price });
    };

    handleTheftProtectionChange = (e) => {
        const theftProtection = e.target.checked;
        const { car, from, to, cancellation, amendments, collisionDamageWaiver, fullInsurance, additionalDriver } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ theftProtection, price });
    };

    handleCollisionDamageWaiverChange = (e) => {
        const collisionDamageWaiver = e.target.checked;
        const { car, from, to, cancellation, amendments, theftProtection, fullInsurance, additionalDriver } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ collisionDamageWaiver, price });
    };

    handleFullInsuranceChange = (e) => {
        const fullInsurance = e.target.checked;
        const { car, from, to, cancellation, amendments, theftProtection, collisionDamageWaiver, additionalDriver } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ fullInsurance, price });
    };

    handleAdditionalDriverChange = (e) => {
        const additionalDriver = e.target.checked;
        const { car, from, to, cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance } = this.state;
        const options = { cancellation, amendments, theftProtection, collisionDamageWaiver, fullInsurance, additionalDriver };
        const price = Helper.price(car, from, to, options)
        this.setState({ additionalDriver, price });
    };

    handleOnChangeFullName = (e) => {
        this.setState({
            fullName: e.target.value,
        });
    };

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        });

        if (!e.target.value) {
            this.setState({ emailRegitered: false, emailValid: true });
        }
    };

    validateEmail = async (email) => {
        if (email) {
            if (validator.isEmail(email)) {
                try {
                    const status = await UserService.validateEmail({ email });
                    if (status === 200) {
                        this.setState({ emailRegitered: false, emailValid: true, emailInfo: true });
                        return true;
                    } else {
                        this.setState({ emailRegitered: true, emailValid: true, error: false, emailInfo: false });
                        return false;
                    }
                } catch (err) {
                    Helper.error(err);
                    this.setState({ emailRegitered: false, emailValid: true, emailInfo: true });
                    return false;
                }
            } else {
                this.setState({ emailRegitered: false, emailValid: false, emailInfo: false });
                return false;
            }
        } else {
            this.setState({ emailRegitered: false, emailValid: true, emailInfo: true });
            return false;
        }
    };

    // additionalDriver
    _validateEmail = (email) => {
        if (email) {
            if (validator.isEmail(email)) {
                this.setState({ _emailValid: true });
                return true;
            } else {
                this.setState({ _emailValid: false });
                return false;
            }
        } else {
            this.setState({ _emailValid: true });
            return false;
        }
    };

    handleEmailBlur = async (e) => {
        await this.validateEmail(e.target.value);
    };

    handlePhoneChange = (e) => {
        this.setState({ phone: e.target.value });

        if (!e.target.value) {
            this.setState({ phoneValid: true });
        }
    };

    validatePhone = (phone) => {
        if (phone) {
            const phoneValid = validator.isMobilePhone(phone);
            this.setState({ phoneValid, phoneInfo: phoneValid });

            return phoneValid;
        } else {
            this.setState({ phoneValid: true, phoneInfo: true });

            return true;
        }
    };

    // additionalDriver
    _validatePhone = (phone) => {
        if (phone) {
            const _phoneValid = validator.isMobilePhone(phone);
            this.setState({ _phoneValid });

            return _phoneValid;
        } else {
            this.setState({ phoneValid: true });

            return true;
        }
    };

    handlePhoneBlur = (e) => {
        this.validatePhone(e.target.value);
    };

    validateBirthDate = (date) => {
        if (date) {
            const { car } = this.state;

            const now = new Date();
            const sub = intervalToDuration({ start: date, end: now }).years;
            const birthDateValid = sub >= car.minimumAge;

            this.setState({ birthDateValid });
            return birthDateValid;
        } else {
            this.setState({ birthDateValid: true });
            return true;
        }
    };

    // additionalDriver
    _validateBirthDate = (date) => {
        if (date) {
            const { car } = this.state;

            const now = new Date();
            const sub = intervalToDuration({ start: date, end: now }).years;
            const _birthDateValid = sub >= car.minimumAge;

            this.setState({ birthDateValid: _birthDateValid });
            return _birthDateValid;
        } else {
            this.setState({ _birthDateValid: true });
            return true;
        }
    };

    handleTosChange = (event) => {
        this.setState({ tosChecked: event.target.checked });

        if (event.target.checked) {
            this.setState({ tosError: false });
        }
    };

    validateCardNumber = (cardNumber) => {
        if (cardNumber) {
            const cardNumberValid = validator.isCreditCard(cardNumber);
            this.setState({ cardNumberValid });

            return cardNumberValid;
        } else {
            this.setState({ cardNumberValid: true });

            return true;
        }
    };

    handleCardNumberBlur = (e) => {
        this.validateCardNumber(e.target.value);
    };

    handleCardNumberChange = (e) => {
        this.setState({ cardNumber: e.target.value });

        if (!e.target.value) {
            this.setState({ cardNumberValid: true });
        }
    };

    validateCardMonth = (cardMonth) => {
        if (cardMonth) {

            if (Helper.isInteger(cardMonth)) {
                const month = parseInt(cardMonth);
                const cardMonthValid = month >= 1 && month <= 12;
                this.setState({ cardMonthValid, cardDateError: false });

                return cardMonthValid;
            } else {
                this.setState({ cardMonthValid: false, cardDateError: false });

                return false;
            }
        } else {
            this.setState({ cardMonthValid: true, cardDateError: false });

            return true;
        }
    };

    handleCardMonthBlur = (e) => {
        this.validateCardMonth(e.target.value);
    };

    handleCardMonthChange = (e) => {
        this.setState({ cardMonth: e.target.value });

        if (!e.target.value) {
            this.setState({ cardMonthValid: true, cardDateError: false });
        }
    };

    validateCardYear = (cardYear) => {
        if (cardYear) {

            if (Helper.isYear(cardYear)) {
                const year = parseInt(cardYear);
                const currentYear = parseInt(new Date().getFullYear().toString().slice(2));
                const cardYearValid = year >= currentYear;
                this.setState({ cardYearValid, cardDateError: false });

                return cardYearValid;
            } else {
                this.setState({ cardYearValid: false, cardDateError: false });

                return false;
            }
        } else {
            this.setState({ cardYearValid: true, cardDateError: false });

            return true;
        }
    };

    handleCardYearBlur = (e) => {
        this.validateCardYear(e.target.value);
    };

    handleCardYearChange = (e) => {
        this.setState({ cardYear: e.target.value });

        if (!e.target.value) {
            this.setState({ cardYear: true, cardDateError: false });
        }
    };

    validateCvv = (cvv) => {
        if (cvv) {
            const cvvValid = Helper.isCvv(cvv);
            this.setState({ cvvValid });

            return cvvValid;
        } else {
            this.setState({ cvvValid: true });

            return true;
        }
    };

    handleCvvBlur = (e) => {
        this.validateCvv(e.target.value);
    };

    handleCvvChange = (e) => {
        this.setState({ cvv: e.target.value });

        if (!e.target.value) {
            this.setState({ cvvValid: true });
        }
    };

    validateCardDate = (cardMonth, cardYear) => {
        const today = new Date(), cardDate = new Date();
        const y = parseInt(today.getFullYear().toString().slice(0, 2)) * 100;
        const year = y + parseInt(cardYear);
        const month = parseInt(cardMonth);
        cardDate.setFullYear(year, month - 1, 1);

        if (cardDate < today) {
            return false;
        }

        return true;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { authenticated, email, phone, birthDate, tosChecked, cardNumber, cardMonth, cardYear, cvv,
            additionalDriver, _email, _phone, _birthDate, payLater } = this.state;

        if (!authenticated) {
            const emailValid = await this.validateEmail(email);
            if (!emailValid) {
                return;
            }

            const phoneValid = this.validatePhone(phone);
            if (!phoneValid) {
                return;
            }

            const birthDateValid = this.validateBirthDate(birthDate);
            if (!birthDateValid) {
                return;
            }

            if (!tosChecked) {
                return this.setState({ tosError: true });
            }
        }

        if (!payLater) {
            const cardNumberValid = this.validateCardNumber(cardNumber);
            if (!cardNumberValid) {
                return;
            }

            const cardMonthValid = this.validateCardMonth(cardMonth);
            if (!cardMonthValid) {
                return;
            }

            const cardYearValid = this.validateCardYear(cardYear);
            if (!cardYearValid) {
                return;
            }

            const cvvValid = this.validateCvv(cvv);
            if (!cvvValid) {
                return;
            }

            const cardDateValid = this.validateCardDate(cardMonth, cardYear);
            if (!cardDateValid) {
                return this.setState({ cardDateError: true });
            }
        }

        if (additionalDriver) {
            const emailValid = this._validateEmail(_email);
            if (!emailValid) {
                return;
            }

            const phoneValid = this._validatePhone(_phone);
            if (!phoneValid) {
                return;
            }

            const birthDateValid = this._validateBirthDate(_birthDate);
            if (!birthDateValid) {
                return;
            }
        }

        this.setState({ loading: true });

        const { user,
            fullName,
            car,
            pickupLocation,
            dropOffLocation,
            from,
            to,
            cancellation,
            amendments,
            theftProtection,
            collisionDamageWaiver,
            fullInsurance,
            price,
            _fullName
        } = this.state;

        let booking, driver, _additionalDriver;

        if (!authenticated) driver = { email, phone, fullName, birthDate, language: UserService.getLanguage() };

        booking = {
            company: car.company._id,
            car: car._id,
            driver: authenticated ? user._id : undefined,
            pickupLocation: pickupLocation._id,
            dropOffLocation: dropOffLocation._id,
            from: from,
            to: to,
            status: payLater ? Env.BOOKING_STATUS.PENDING : Env.BOOKING_STATUS.PAID,
            cancellation,
            amendments,
            theftProtection,
            collisionDamageWaiver,
            fullInsurance,
            additionalDriver,
            price
        };

        if (additionalDriver) {
            _additionalDriver = {
                fullName: _fullName,
                email: _email,
                phone: _phone,
                birthDate: _birthDate
            };
        }

        const payload = { driver, booking, additionalDriver: _additionalDriver, payLater };

        BookingService.book(payload)
            .then(status => {
                if (status === 200) {
                    window.history.replaceState({}, window.document.title, '/create-booking');
                    this.setState({ loading: false, visible: false, success: true });
                } else {
                    this.setState({ loading: false });
                    Helper.error();
                }
            })
            .catch((err) => {
                this.setState({ loading: false });
                Helper.error(err);
            });

    };

    onLoad = (user) => {
        this.setState({ user, authenticated: user !== undefined, language: UserService.getLanguage() }, async () => {

            let carId, car, pickupLocationId, pickupLocation, dropOffLocationId, dropOffLocation, from, to;
            const params = new URLSearchParams(window.location.search);
            if (params.has('c')) carId = params.get('c');
            if (params.has('p')) pickupLocationId = params.get('p');
            if (params.has('d')) dropOffLocationId = params.get('d');
            if (params.has('f')) {
                const val = params.get('f');
                from = Helper.isNumber(val) && new Date(parseInt(val));
            }
            if (params.has('t')) {
                const val = params.get('t');
                to = Helper.isNumber(val) && new Date(parseInt(val));
            }

            if (!carId || !pickupLocationId || !dropOffLocationId || !from || !to) {
                return this.setState({ noMatch: true });
            }

            try {
                car = await CarService.getCar(carId);
                if (!car) {
                    return this.setState({ noMatch: true });
                }

                pickupLocation = await LocationService.getLocation(pickupLocationId);

                if (!pickupLocation) {
                    return this.setState({ noMatch: true });
                }

                if (dropOffLocationId !== pickupLocationId) {
                    dropOffLocation = await LocationService.getLocation(dropOffLocationId);
                } else {
                    dropOffLocation = pickupLocation;
                }

                if (!dropOffLocation) {
                    return this.setState({ noMatch: true });
                }

                const price = Helper.price(car, from, to);

                const included = (val) => val === 0;

                this.setState({
                    car,
                    price,
                    pickupLocation,
                    dropOffLocation,
                    from,
                    to,
                    cancellation: included(car.cancellation),
                    amendments: included(car.amendments),
                    theftProtection: included(car.theftProtection),
                    collisionDamageWaiver: included(car.collisionDamageWaiver),
                    fullInsurance: included(car.fullInsurance),
                    additionalDriver: included(car.additionalDriver),
                    visible: true
                });

            } catch (err) {
                Helper.error(err);
            }

        });
    }

    render() {
        const {
            visible,
            language,
            authenticated,
            noMatch,
            emailValid,
            emailRegitered,
            phoneValid,
            tosChecked,
            cardNumberValid,
            cardMonthValid,
            cardYearValid,
            cvvValid,
            tosError,
            error,
            from,
            to,
            pickupLocation,
            dropOffLocation,
            car,
            price,
            emailInfo,
            phoneInfo,
            cancellation,
            amendments,
            theftProtection,
            collisionDamageWaiver,
            fullInsurance,
            additionalDriver,
            cardDateError,
            success,
            loading,
            birthDateValid,
            _emailValid,
            _phoneValid,
            _birthDateValid,
            payLater } = this.state;

        const _fr = language === 'fr';
        const _locale = _fr ? fr : enUS;
        const _format = _fr ? 'eee d LLL kk:mm' : 'eee, d LLL, kk:mm';
        const bookingDetailHeight = Env.COMPANY_IMAGE_HEIGHT + 10;
        const days = Helper.days(from, to);


        return (
            <Master onLoad={this.onLoad} strict={false}>
                {visible && car &&
                    <div className="booking">
                        <Paper className="booking-form" elevation={10}>
                            <h1 className="booking-form-title"> {strings.BOOKING_HEADING} </h1>
                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <div className='booking-options-container'>
                                        <div className='booking-info'>
                                            <BookingIcon />
                                            <label>{strings.BOOKING_OPTIONS}</label>
                                        </div>
                                        <div className='booking-options'>
                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.cancellation === -1 || car.cancellation === 0}
                                                    control={
                                                        <Switch
                                                            checked={cancellation}
                                                            onChange={this.handleCancellationChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.CANCELLATION}</span>
                                                            <span className='booking-option-value'>{Helper.getCancellationOption(car.cancellation, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.amendments === -1 || car.amendments === 0}
                                                    control={
                                                        <Switch checked={amendments}
                                                            onChange={this.handleAmendmentsChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.AMENDMENTS}</span>
                                                            <span className='booking-option-value'>{Helper.getAmendmentsOption(car.amendments, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.collisionDamageWaiver === -1 || car.collisionDamageWaiver === 0}
                                                    control={
                                                        <Switch checked={collisionDamageWaiver}
                                                            onChange={this.handleCollisionDamageWaiverChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.COLLISION_DAMAGE_WAVER}</span>
                                                            <span className='booking-option-value'>{Helper.getCollisionDamageWaiverOption(car.collisionDamageWaiver, days, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.theftProtection === -1 || car.theftProtection === 0}
                                                    control={
                                                        <Switch checked={theftProtection}
                                                            onChange={this.handleTheftProtectionChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.THEFT_PROTECTION}</span>
                                                            <span className='booking-option-value'>{Helper.getTheftProtectionOption(car.theftProtection, days, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.fullInsurance === -1 || car.fullInsurance === 0}
                                                    control={
                                                        <Switch checked={fullInsurance}
                                                            onChange={this.handleFullInsuranceChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.FULL_INSURANCE}</span>
                                                            <span className='booking-option-value'>{Helper.getFullInsuranceOption(car.fullInsurance, days, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="dense" >
                                                <FormControlLabel
                                                    disabled={car.additionalDriver === -1 || car.additionalDriver === 0}
                                                    control={
                                                        <Switch checked={additionalDriver}
                                                            onChange={this.handleAdditionalDriverChange}
                                                            color="primary" />
                                                    }
                                                    label={
                                                        <span>
                                                            <span className='booking-option-label'>{csStrings.ADDITIONAL_DRIVER}</span>
                                                            <span className='booking-option-value'>{Helper.getAdditionalDriverOption(car.additionalDriver, days, _fr)}</span>
                                                        </span>
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    </div>

                                    <div className='booking-details-container'>
                                        <div className='booking-info'>
                                            <CarIcon />
                                            <label>{strings.BOOKING_DETAILS}</label>
                                        </div>
                                        <div className='booking-details'>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{strings.DAYS}</label>
                                                <div className='booking-detail-value'>
                                                    {`${Helper.getDaysShort(Helper.days(from, to))} (${Helper.capitalize(format(from, _format, { locale: _locale }))} - ${Helper.capitalize(format(to, _format, { locale: _locale }))})`}
                                                </div>
                                            </div>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{commonStrings.PICKUP_LOCATION}</label>
                                                <div className='booking-detail-value'>{pickupLocation.name}</div>
                                            </div>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{commonStrings.DROP_OFF_LOCATION}</label>
                                                <div className='booking-detail-value'>{dropOffLocation.name}</div>
                                            </div>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{strings.CAR}</label>
                                                <div className='booking-detail-value'>
                                                    {`${car.name} (${car.price} ${csStrings.CAR_CURRENCY})`}
                                                </div>
                                            </div>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{commonStrings.SUPPLIER}</label>
                                                <div className='booking-detail-value'>
                                                    <div className='car-company'>
                                                        <img src={Helper.joinURL(Env.CDN_USERS, car.company.avatar)}
                                                            alt={car.company.fullName}
                                                            style={{ height: Env.COMPANY_IMAGE_HEIGHT }}
                                                        />
                                                        <label className='car-company-name'>{car.company.fullName}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='booking-detail' style={{ height: bookingDetailHeight }}>
                                                <label className='booking-detail-title'>{strings.COST}</label>
                                                <div className='booking-detail-value booking-price'>{`${price} ${commonStrings.CURRENCY}`}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        !authenticated &&
                                        <div className='driver-details'>
                                            <div className='booking-info'>
                                                <DriverIcon />
                                                <label>{strings.DRIVER_DETAILS}</label>
                                            </div>
                                            <div className='driver-details-form'>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.FULL_NAME}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.FULL_NAME}
                                                        required
                                                        onChange={this.handleOnChangeFullName}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.EMAIL}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.EMAIL}
                                                        error={!emailValid || emailRegitered}
                                                        onBlur={this.handleEmailBlur}
                                                        onChange={this.handleEmailChange}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <FormHelperText error={!emailValid || emailRegitered}>
                                                        {(!emailValid && commonStrings.EMAIL_NOT_VALID) || ''}
                                                        {(emailRegitered &&
                                                            <span>
                                                                <span>{commonStrings.EMAIL_ALREADY_REGISTERED}</span>
                                                                <span> </span>
                                                                <a href={`/sign-in?c=${car._id}&p=${pickupLocation._id}&d=${dropOffLocation._id}&f=${from.getTime()}&t=${to.getTime()}&from=create-booking`}>{strings.SIGN_IN}</a>
                                                            </span>
                                                        ) || ''}
                                                        {(emailInfo && strings.EMAIL_INFO) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.PHONE}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.PHONE}
                                                        error={!phoneValid}
                                                        onBlur={this.handlePhoneBlur}
                                                        onChange={this.handlePhoneChange}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <FormHelperText error={!phoneValid}>
                                                        {(!phoneValid && commonStrings.PHONE_NOT_VALID) || ''}
                                                        {(phoneInfo && strings.PHONE_INFO) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <DatePicker
                                                        label={commonStrings.BIRTH_DATE}
                                                        variant='outlined'
                                                        error={!birthDateValid}
                                                        required
                                                        onChange={(birthDate) => {
                                                            const birthDateValid = this.validateBirthDate(birthDate);
                                                            this.setState({ birthDate, birthDateValid });
                                                        }}
                                                        language={language}
                                                    />
                                                    <FormHelperText error={!birthDateValid}>
                                                        {(!birthDateValid && Helper.getBirthDateError(car.minimumAge)) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <div className="booking-tos">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <Checkbox
                                                                        checked={tosChecked}
                                                                        onChange={this.handleTosChange}
                                                                        color="primary"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Link href="/tos" target="_blank" rel="noreferrer">{commonStrings.TOS}</Link>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        additionalDriver &&
                                        <div className='driver-details'>
                                            <div className='booking-info'>
                                                <DriverIcon />
                                                <label>{csStrings.ADDITIONAL_DRIVER}</label>
                                            </div>
                                            <div className='driver-details-form'>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.FULL_NAME}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.FULL_NAME}
                                                        required
                                                        onChange={(e) => {
                                                            this.setState({ _fullName: e.target.value });
                                                        }}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.EMAIL}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.EMAIL}
                                                        error={!_emailValid}
                                                        onBlur={(e) => {
                                                            this._validateEmail(e.target.value);
                                                        }}
                                                        onChange={(e) => {
                                                            this.setState({ _email: e.target.value });

                                                            if (!e.target.value) {
                                                                this.setState({ _emailValid: true });
                                                            }
                                                        }}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <FormHelperText error={!_emailValid}>
                                                        {(!_emailValid && commonStrings.EMAIL_NOT_VALID) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <InputLabel className='required'>{commonStrings.PHONE}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={commonStrings.PHONE}
                                                        error={!_phoneValid}
                                                        onBlur={(e) => {
                                                            this._validatePhone(e.target.value);
                                                        }}
                                                        onChange={(e) => {
                                                            this.setState({ _phone: e.target.value });

                                                            if (!e.target.value) {
                                                                this.setState({ _phoneValid: true });
                                                            }
                                                        }}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <FormHelperText error={!_phoneValid}>
                                                        {(!_phoneValid && commonStrings.PHONE_NOT_VALID) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <FormControl fullWidth margin="dense">
                                                    <DatePicker
                                                        label={commonStrings.BIRTH_DATE}
                                                        variant='outlined'
                                                        error={!_birthDateValid}
                                                        required
                                                        onChange={(_birthDate) => {
                                                            const _birthDateValid = this._validateBirthDate(_birthDate);
                                                            this.setState({ _birthDate, _birthDateValid });
                                                        }}
                                                        language={language}
                                                    />
                                                    <FormHelperText error={!_birthDateValid}>
                                                        {(!_birthDateValid && Helper.getBirthDateError(car.minimumAge)) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    }

                                    {
                                        car.company.payLater &&
                                        <div className='payment-options-container'>
                                            <div className='booking-info'>
                                                <PaymentOptionsIcon />
                                                <label>{strings.PAYMENT_OPTIONS}</label>
                                            </div>
                                            <div className='payment-options'>
                                                <FormControl>
                                                    <RadioGroup
                                                        defaultValue="payOnline"
                                                        onChange={(event) => {
                                                            this.setState({ payLater: event.target.value === 'payLater' });
                                                        }}
                                                    >
                                                        <FormControlLabel value="payLater" control={<Radio />} label={
                                                            <span className='payment-button'>
                                                                <span>{strings.PAY_LATER}</span>
                                                                <span className='payment-info'>{`(${strings.PAY_LATER_INFO})`}</span>
                                                            </span>
                                                        } />
                                                        <FormControlLabel value="payOnline" control={<Radio />} label={
                                                            <span className='payment-button'>
                                                                <span>{strings.PAY_ONLINE}</span>
                                                                <span className='payment-info'>{`(${strings.PAY_ONLINE_INFO})`}</span>
                                                            </span>
                                                        } />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </div>
                                    }

                                    {
                                        (!car.company.payLater || !payLater) &&
                                        <div className='payment'>

                                            <div className='cost'>
                                                <div className='secure-payment-label'>
                                                    <LockIcon className='secure-payment-lock' />
                                                    <label>{strings.PAYMENT}</label>
                                                </div>
                                                <div className='secure-payment-cost'>
                                                    <label className='cost-title'>{strings.COST}</label>
                                                    <label className='cost-value'>{`${price} ${commonStrings.CURRENCY}`}</label>
                                                </div>
                                            </div>

                                            <div className='secure-payment-logo'>
                                                <img src={SecurePayment} alt='' />
                                            </div>

                                            <div className='card'>
                                                <FormControl margin="dense" className='card-number' fullWidth>
                                                    <InputLabel className='required'>{strings.CARD_NAME}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={strings.CARD_NAME}
                                                        onChange={(e) => {
                                                            this.setState({ cardName: e.target.value });
                                                        }}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormControl margin="dense" className='card-number' fullWidth>
                                                    <InputLabel className='required'>{strings.CARD_NUMBER}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={strings.CARD_NUMBER}
                                                        error={!cardNumberValid}
                                                        onBlur={this.handleCardNumberBlur}
                                                        onChange={this.handleCardNumberChange}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <FormHelperText error={!cardNumberValid}>
                                                        {(!cardNumberValid && strings.CARD_NUMBER_NOT_VALID) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                                <div className='card-date'>
                                                    <FormControl margin="dense" className='card-month' fullWidth>
                                                        <InputLabel className='required'>{strings.CARD_MONTH}</InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            label={strings.CARD_MONTH}
                                                            error={!cardMonthValid}
                                                            onBlur={this.handleCardMonthBlur}
                                                            onChange={this.handleCardMonthChange}
                                                            required
                                                            autoComplete="off"
                                                        // inputProps={{ inputMode: 'numeric', pattern: '^(\\s*|\\d{1,2})$' }}
                                                        />
                                                        <FormHelperText error={!cardMonthValid}>
                                                            {(!cardMonthValid && strings.CARD_MONTH_NOT_VALID) || ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <FormControl margin="dense" className='card-year' fullWidth>
                                                        <InputLabel className='required'>{strings.CARD_YEAR}</InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            label={strings.CARD_YEAR}
                                                            error={!cardYearValid}
                                                            onBlur={this.handleCardYearBlur}
                                                            onChange={this.handleCardYearChange}
                                                            required
                                                            autoComplete="off"
                                                        // inputProps={{ inputMode: 'numeric', pattern: '^(\\s*|\\d{2})$' }}
                                                        />
                                                        <FormHelperText error={!cardYearValid}>
                                                            {(!cardYearValid && strings.CARD_YEAR_NOT_VALID) || ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </div>
                                                <FormControl margin="dense" className='cvv' fullWidth>
                                                    <InputLabel className='required'>{strings.CVV}</InputLabel>
                                                    <OutlinedInput
                                                        type="text"
                                                        label={strings.CVV}
                                                        error={!cvvValid}
                                                        onBlur={this.handleCvvBlur}
                                                        onChange={this.handleCvvChange}
                                                        required
                                                        autoComplete="off"
                                                    // inputProps={{ inputMode: 'numeric', pattern: '^(\\s*|\\d{3,4})$' }}
                                                    />
                                                    <FormHelperText error={!cvvValid}>
                                                        {(!cvvValid && strings.CVV_NOT_VALID) || ''}
                                                    </FormHelperText>
                                                </FormControl>
                                            </div>

                                            <div className='secure-payment-info'>
                                                <LockIcon className='secure-payment-lock' />
                                                <label>{strings.SECURE_PAYMENT_INFO}</label>
                                            </div>
                                        </div>
                                    }
                                    <div className="booking-buttons">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className='btn-book btn-margin-bottom'
                                            size="small"
                                        >
                                            {strings.BOOK}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className='btn-cancel btn-margin-bottom'
                                            size="small"
                                            href="/">
                                            {commonStrings.CANCEL}
                                        </Button>
                                    </div>
                                </div>
                                <div className="form-error">
                                    {cardDateError && <Error message={strings.CARD_DATE_ERROR} />}
                                    {tosError && <Error message={commonStrings.TOS_ERROR} />}
                                    {error && <Error message={commonStrings.GENERIC_ERROR} />}
                                </div>
                            </form>
                        </Paper>
                    </div>
                }
                {noMatch && <NoMatch hideHeader />}
                {success && <Info message={payLater ? strings.PAY_LATER_SUCCESS : strings.SUCCESS} />}
                {loading && <Backdrop text={commonStrings.PLEASE_WAIT} />}
            </Master>
        );
    }
}