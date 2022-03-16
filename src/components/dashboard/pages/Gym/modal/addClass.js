import React, {useState, useEffect, useContext} from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import {BsPlusCircleFill, BsCheckCircleFill} from 'react-icons/bs';
import TimePicker from 'react-time-picker-input';
import {BsArrowRight} from 'react-icons/bs';
import "react-time-picker-input/dist/components/TimeInput.css"
import { saveClassesForGym } from "../../../../../fiebaseImp/js/gym";
import UserContext from "../../../../../context/UserContext";
import DateTimePicker from 'react-datetime-picker';
// import CustomLoading from "../../../../items/loadingBar";

const Container = styled('div')`
    width: 540px;
    background-color: black;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
    .react-datetime-picker {
        display: inline-flex;
        position: relative;
    }
    .react-datetime-picker,
    .react-datetime-picker *,
    .react-datetime-picker *:before,
    .react-datetime-picker *:after {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    .react-datetime-picker--disabled {
        background-color: #f0f0f0;
        color: #6d6d6d;
    }
    .react-datetime-picker__wrapper {
        display: flex;
        flex-grow: 1;
        flex-shrink: 0;
        border: 1px solid #888888;
        border-radius: 12px;
        height: 50px;
        color: #888888;
        font-size: 16px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .react-datetime-picker__inputGroup {
        min-width: calc(4px + (4px * 3) +  0.54em * 6  +  0.217em * 2);
        flex-grow: 1;
        padding: 0 2px;
    }
    .react-datetime-picker__inputGroup__divider {
        padding: 1px 0;
        white-space: pre;
    }
    .react-datetime-picker__inputGroup__input {
        min-width: 0.54em;
        height: calc(100% - 2px);
        color: #888888;
        position: relative;
        padding: 1px;
        border: 0;
        background: none;
        font: inherit;
        box-sizing: content-box;
        -moz-appearance: textfield;
    }
    .react-datetime-picker__inputGroup__input::-webkit-outer-spin-button,
    .react-datetime-picker__inputGroup__input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .react-datetime-picker__inputGroup__input:invalid {
        background: rgba(255, 0, 0, 0.1);
    }
    .react-datetime-picker__inputGroup__input--hasLeadingZero {
        margin-left: -0.54em;
        padding-left: calc(1px +  0.54em);
    }
    .react-datetime-picker__inputGroup__amPm {
        font: inherit;
        -moz-appearance: menulist;
    }
    .react-datetime-picker__button {
        border: 0;
        background: transparent;
        padding: 4px 6px;
        color: #888888;
    }
    .react-datetime-picker__button:enabled {
    cursor: pointer;
    }
    .react-datetime-picker__button:enabled:hover .react-datetime-picker__button__icon,
    .react-datetime-picker__button:enabled:focus .react-datetime-picker__button__icon {
        stroke: #888888;
    }
    .react-datetime-picker__button:disabled .react-datetime-picker__button__icon {
        stroke: #888888;
    }
    .react-datetime-picker__button svg {
        display: inherit;
        stroke: #888888;
    }
    .react-datetime-picker__calendar,
    .react-datetime-picker__clock {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1;
    }
    .react-datetime-picker__calendar--closed,
    .react-datetime-picker__clock--closed {
        display: none;
    }
    .react-datetime-picker__calendar {
        width: 350px;
        max-width: 100vw;
    }
    .react-datetime-picker__calendar .react-calendar {
        border-width: thin;
    }
    .react-datetime-picker__clock {
        width: 200px;
        height: 200px;
        max-width: 100vw;
        padding: 25px;
        background-color: white;
        border: thin solid #a0a096;
    }

    .error {
        border-color: red !important;
    }
    .header {
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        text-transform: uppercase;
        color: #F2F2F2;
    }
    .content {
        display:flex;
        flex-direction: column;
        margin-top: 40px;
    }
    .label{
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0.01em;
        color: #888888;
        margin-bottom: 8px;
    }
    .input {
        color: #888888;
        background: #1C1A1D;
        border-radius: 12px;
        border: 1px solid #888888;
        height: 50px;
        padding-left: 10px;
        margin-bottom: 20px;
    }
    .button{
        cursor: pointer;
        width: 110px;
        height: 50px; 
        display: flex;
        justify-content: center;
        align-items: center;
        color: #F2F2F2;
        font-size: 18px;
        line-height: 22px;
        border-radius: 10px;
        border: 1px solid #888888;
        margin-left: 16px;
    }
    .button.active{
        text-transform: uppercase;
        color: #000000;
        background: #FECA00;
        border: none;
    }
    .button-group{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 40px;
    }
    .description {
        display: flex;
        flex-direction: column;
        overflow : auto;
        max-height: 140px;
        padding: 10px 0px;
        
        li {
            font-size: 14px;
            line-height: 17px;
            letter-spacing: 0.01em;
            color: #F2F2F2;
            margin-bottom: 6px;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background-color: #888888;
            border-radius: 100px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 100px;
            background-color: #FFCC00;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8);
        }
    }
    .description-layout {
        display: flex;
        flex-direction: column;
        height: 250px;
        margin-bottom: 20px;
    }
    .create-description {
        display: flex;
        flex-direction: column;
    }
    .disable {
        display: none;
    }
    .button-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 160%;
        color: #888888;
        margin-top:10px;
        span {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        
        .create-container{
            display:flex;
            flex-direction: row;
            gap: 20px;
        }
        .add {
            color:#FECA00;
        }
        .icon {
            margin-right: 8px;
            font-size: 18px;
        }
    }
    
    .time-layout {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 20px;
    }
    .message {
        display: flex;
        align-items: center;
        margin-top: 10px;
        height: 20px;
    }
    .error-msg {
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0.01em;
        color: red;
    }
    .success-msg {
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0.01em;
        color: #F2F2F2;
    }
    .react-time-input-picker-wrapper {
        border-radius: 12px;
        height: 50px;
        width: 40%;
        border: 1px solid #888888;
        color: #888888;
    }
    .react-time-input-picker {
        color: #888888 !important;
    }
    .react-time-input-picker input {
        color: #888888;
    }
    .arrow {
        color: #888888;
        font-size: 18px;
    }
    @media (max-width: 768px) {
        width: 300px;
        height: unset;
        .header {
            margin-bottom: 20px;
        }
        
        .button {
            margin-right: 0px;
        }
        .button-group {
            justify-content: space-between;
            margin-top: 30px;
        }
    }
`;


const AddClass = (props) => {
    const {t} = useTranslation();
    // const [user, setUser] = useContext(UserContext);
    const user = JSON.parse(localStorage.getItem('state'));
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [capacity, setPriority] = useState('');
    const [duration, setDuration] = useState('');

    const [nameError, setNameError] = useState(false);
    const [capacityError, setCapacityError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [durationError, setDurationError] = useState(false);

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isCreated, setIsCreated] = useState(false);
    // const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setIsOpen(props.isOpen);
    }, [props]);

    const resetStates = ()=>{
        setName('');
        setIsSaving(false);
        setNameError(false);
        setCapacityError(false);
        setDuration('');
        setDurationError(false);
        setPriority('');
        setIsCreated(false);
        setStartTime('');
        setEndTime('');
    }
    const hideModal = () => {   
        resetStates();
        emptyMessage();
        setIsOpen(false);
        if(isCreated){
            props.refresh();
        }
        props.close();
    }
    const emptyMessage = ()=>{
        setCreateError(false);
        setCreateSuccess(false);
    }
    const onSave = () => {
        // setLoading(true)
        if(name === '' || 
            duration === '' ||
            capacity === '' || isNaN(capacity)){
            setNameError(name === '');
            setDurationError(duration === '');
            setCapacityError(capacity === '' || isNaN(capacity));
            // setLoading(false)
            return;
        }
        if(isSaving){
            return;
        }
        setIsSaving(true);
        saveClassesForGym(user.content.qrCode, 
            {
                name: name,
                address: user.content.address,
                capacity: capacity,
                duration: duration,
                ends_date: endTime,
                gym: user.content.qrCode,
                location: user.content.location,
                starts_date: startTime
            }
        ).then(data=>{
            setIsSaving(false);
            setIsCreated(true);
            // setLoading(false)
        })
        
    }
    return (
        <Modal
        show={isOpen}
        onHide={hideModal}
        centered
        dialogClassName="login-modal"
        >  
            {/* <CustomLoading isStart={loading}/> */}

            <Container>
                <div className="header">
                    {t('Create Class')}
                </div>
                <div className="content">
                    <span className="label">
                        {t('Name')}
                    </span>
                    <input 
                        className={nameError? "input error" :"input"}
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            emptyMessage();
                            setNameError(false);
                        }}/>
                    <span className="label">
                        {t('Duration')}
                    </span>
                    <input 
                        className={durationError? "input error" :"input"}
                        value={duration}
                        onChange={e => {
                            setDuration(e.target.value);
                            emptyMessage();
                            setDurationError(false);
                        }}/>
                    <div className="time-layout">
                        <DateTimePicker
								value={startTime}
								defaultValue='' 
								onChange={(value)=>setStartTime(value)}
								placeholderText="select start time"
								></DateTimePicker>
                        {/* <TimePicker 
                            onChange={(value)=>setStartTime(value)}
                            eachInputDropdown manuallyDisplayDropdown
                            value={startTime}/> */}
                        <BsArrowRight className="arrow"/>
                        {/* <TimePicker 
                            onChange={(value)=>setEndTime(value)}
                            eachInputDropdown manuallyDisplayDropdown
                            value={endTime}/> */}
                        <DateTimePicker
                            value={endTime}
                            defaultValue='' minDate={startTime}
                            onChange={(value)=>setEndTime(value)}
                            
                            placeholderText="select start time"
                            ></DateTimePicker>
                    </div>
                    <span className="label">
                        {t('Capacity')}
                    </span>
                    <input 
                        className={capacityError? "input error": "input"}
                        value={capacity}
                        onChange={e =>{
                            emptyMessage();
                            setCapacityError(false);
                            setPriority(e.target.value);
                        }}/>
                   
                </div>
                <div className="message">
                    { 
                        createError &&
                        <span className="error-msg">
                            {t('Cannot create a new membership. Try again.')}
                        </span>
                    }
                    {
                        createSuccess && 
                        <span className="success-msg">
                            {t('New Membership is created successfully.')}
                        </span>
                    }
                </div>
                <div className="button-group">
                    <span className="button" onClick={hideModal}>
                        {t('Cancel')}
                    </span>
                    <span className={isSaving?"button":"button active"} onClick={onSave}>
                        {t('Save')}
                    </span>
                </div>
            </Container>
        </Modal>
    );
}

export default AddClass;