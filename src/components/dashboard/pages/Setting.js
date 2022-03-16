import React, { useContext, useState, useEffect } from 'react';
import Header from './item/Header';
import ReactImageUploading from 'react-images-uploading';
import UserContext from '../../../context/UserContext';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { MdDelete, MdChangeCircle } from 'react-icons/md';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UserTypeArray } from '../../../const/userType';

import { saveGymInfo, createGymId, getGymInfo } from '../../../fiebaseImp/js/gym_main';
import { updateUserImage } from '../../../fiebaseImp/js/user';
import { getMembershipNames } from '../../../fiebaseImp/js/membership';

import styled from 'styled-components';
import { async } from '@firebase/util';
const Container = styled('div')`
    display: flex;
    width: 100%;
    flex-direction: column;
    .content {
        padding: 20px;
        display: flex;
        flex-direction: row;
    }
    .btn{
        width: 150px;
        height: 50px; 
        display: flex;
        justify-content: center;
        align-items: center;
        color: #F2F2F2;
        font-size: 18px;
        line-height: 22px;
        border-radius: 10px;
        border: 1px solid #888888;
        margin:auto;
    }
    .btn.active{
        text-transform: uppercase;
        color: #000000;
        background: #FECA00;
        border: none;
    }
    .image-content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 30px;
        gap: 30px 0px;
        background: black;
        border-radius: 25px;
        margin-right: 20px;
        .image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 1px solid #F2F2F2;
            object-fit: cover;
        }
        .button{
            cursor: pointer;
            width: 110px;
            height: 50px; 
            display: flex;
            justify-content: center;
            align-items: center;
            color: #F2F2F1;
            font-size: 18px;
            line-height: 22px;
            border-radius: 10px;
            border: 1px solid #888888;
        }
        .button.active{
            text-transform: uppercase;
            color: #000000;
            background: #FECA00;
            border: none;
        }
        .image-item__btn-wrapper{
            width: 150px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 0px 20px;
            font-size: 24px;
            .update-btn {
                color: white;
            }
            .delete-btn {
                color: red;
            }
        }
    }
    .information {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 25px;
        padding: 20px;
        background: black;
        .header {
            display: flex;
            flex-direction: row;
            justify-content: center;
            color: #F2F2F2;
            font-size: 24px;
        }
        .details {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px 0px;
        }
        .detail {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0px 10px;
        }
        .membership-content {
            display: flex;
            flex-direction: column;
            color: #F2F2F2;
            font-size: 14px;
            padding-left: 16px;
        }
        .label{
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0.01em;
            color: #888888;
        }
        .text {
            font-size: 18px;
            color: #F2F2F2;
            line-height: 100%;
        }
        .input {
            background: #1C1A1D;
            border: 1px solid #888888;
            border-radius: 12px;
            margin-bottom: 20px;
            height: 35px;
            color:#888888;
            padding-left: 10px;
            min-width:150px;
            margin:auto;
            flex-grow:1;
        }
        .labelInput{
            display: flex;
            justify-content:space-between;
            flex-direction: row;
            align-items: center;
            gap: 0px 10px;
            padding:10px 5px;
            span{
                white-space: nowrap;
            }
        }
    }
    .membershipCardImage{
        width: 40%;
        display: flex;
        flex-direction: column;
        border-radius: 25px;
        padding: 20px;
        background: black;
        margin-left:10px;
        .imageContent{
            width: 100%;
            height: 300px;
            border-radius: 10px;
            border: 2px solid #F2F2F2;
            object-fit: cover;
        }
    }
    .w-60{
        width:60% !important;
    }
    .gym-image{
        width: 200px;
        height: 170px;
        border-radius: 10px;
        border: 2px solid #F2F2F2;
        object-fit: cover;
    }
    .bar-container{
        background-color: #888888;
        width: 150px;
        height: 15px;
        border-radius: 10px;
        text-align: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .bar-completed {
        background-color: lightblue;
        width: 150px;
        height: 15px; 
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .bar-label{
        line-height: 100%;
        font-size: 12px;
        color: #F2F2F2;
    }
    .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #F2F2F2;
    }
    .error {
        border-color: red !important;
    }
`;

const Setting = () => {

    const { t } = useTranslation();
    const [user, setUser] = useContext(UserContext);

    const state = JSON.parse(localStorage.getItem('profile'));
    const [uploadingA, setUploadingA] = useState(false);
    const [uploadingG, setUploadingG] = useState(false);
    const [uploadingM, setUploadingM] = useState(false);

    const [AvatarImage, setAvatarImages] = useState([]);
    const [saveAvatarImage, setAvatarSaveImage] = useState(state.photo);

    const [GymImage, setGymImages] = useState([]);
    const [saveGymImage, setGymSaveImage] = useState('');

    const [MembershipImage, setMembershipImages] = useState([]);
    const [saveMembershipImage, setMembershipSaveImage] = useState('');

    const { path } = useLocation();
    const [gymInfo, setGymInfo] = useState('')
    const [membership, setMembership] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState('');

    const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [tradeLicenseNumberError, setTradeLicenseNumberError] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);

    useEffect(() => {
        if (state.membership) {
            getMembershipNames()
                .then(data => {
                    // console.log(data)
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].value === state.membership) {
                            setMembership(data[i].label);
                            setDescription(data[i].description);
                            break;
                        }
                    }
                });

        }
        let type = '';
        state.role.forEach(element => {
            type += UserTypeArray[element] + ', ';
        });
        type = type.replace(/,\s*$/, "");
        setRole(type);

    }, [path]);

    useEffect(() => {
        if (state.gymInfo) {
            getGymInfo(state.gymInfo).then(data => {
                setGymInfo(data);
                setGymSaveImage(data.tradeLicenseFilePath);
            })
        }
    }, []);

    const onChange = (setTempImage, imageList, addUpdateIndex) => {
        // if (type === 'avatar') {
        //     setAvatarImages(imageList);
        // } else if (type === 'gym') {
        //     setGymImages(imageList);
        // } else if (type === 'membership') {
        //     setMembershipImages(imageList);
        // }
        setTempImage(imageList);
    };


    const uploadAvatarImage = () => {
        const imageFile = AvatarImage[0].file;
        const storage = getStorage();
        const userRef = ref(storage, `/users/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(userRef, imageFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                setUploadingA(true);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                setUploadingA(false);

                setAvatarImages([]);
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateUserImage(state.id, downloadURL);
                    setAvatarSaveImage(downloadURL);
                });

            }
        );

    }

    const uploadGymImage = () => {
        const imageFile = GymImage[0].file;
        const storage = getStorage();
        const userRef = ref(storage, `/gym/${tradeLicenseNumber}`);
        const uploadTask = uploadBytesResumable(userRef, imageFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                setUploadingG(true);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                setUploadingG(false);

                setGymImages([]);
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setGymSaveImage(downloadURL);
                });

            }
        );

    }

    const uploadMemberImage = () => {
        const imageFile = MembershipImage[0].file;
        const storage = getStorage();
        const userRef = ref(storage, `/users/${new Date().valueOf().toString()}`);
        const uploadTask = uploadBytesResumable(userRef, imageFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                setUploadingM(true);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                setUploadingM(false);

                setMembershipImages([]);
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateUserImage(state.id, downloadURL);
                    setMembershipSaveImage(downloadURL);
                });

            }
        );

    }

    const onSubmits = async () => {
        // alert('I dont know')
        if (tradeLicenseNumber === '' || companyName === '') {
            setCompanyNameError(companyName === '');
            setTradeLicenseNumberError(tradeLicenseNumber === '');
            return;
        }
        if (saveGymImage === '') {
            alert('first, please upload image');
            return;
        }
        const id = await createGymId();
        saveGymInfo(
            id.id,
            companyName,
            tradeLicenseNumber,
            saveGymImage
        ).then((data) => {
            console.log(data);
            if (data.success === 'success') {
                alert('success!!!')
            }
        });
    }

    return (
        <Container>
            <Header title={t('Information')} button={state.username}
                openModal={() => { }} user={true} />
            <div className='content'>

                <ReactImageUploading
                    value={AvatarImage}
                    onChange={
                        (imageList, addUpdateIndex) =>
                            onChange(
                                setAvatarImages,
                                imageList,
                                addUpdateIndex
                            )
                    }
                    dataURLKey="data_url"
                >

                    {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps
                    }) => (
                        <div className='image-content' {...dragProps}>
                            {
                                AvatarImage.length === 0 &&
                                (saveAvatarImage ?
                                    <img src={saveAvatarImage} alt="" className='image' /> :
                                    <div className='image'></div>
                                )
                            }
                            {AvatarImage.map((image, index) => (
                                <React.Fragment key={index}>
                                    <img src={image.data_url} alt="" className='image' />

                                    <div className="image-item__btn-wrapper">
                                        <div className='update-btn' onClick={() => onImageUpdate(index)}>
                                            <MdChangeCircle />
                                        </div>
                                        <div className='delete-btn' onClick={() => onImageRemove(index)}>
                                            <MdDelete />
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                            {
                                AvatarImage.length === 0 &&

                                <button className='button active' onClick={onImageUpload}>
                                    {t('Select')}
                                </button>
                            }

                            {
                                AvatarImage.length !== 0 &&

                                <button
                                    className='button active'
                                    onClick={() =>
                                        uploadAvatarImage()
                                    }
                                >
                                    {t('Upload')}
                                </button>
                            }
                            {
                                uploadingA &&
                                <div className='overlay'>
                                    {t('Uploading image...')}
                                </div>
                            }
                        </div>

                    )}
                </ReactImageUploading>

                <div className='information'>
                    <div className='header'>
                        {t('My Information')}
                    </div>

                    <div className='details'>
                        <div className='detail'>
                            <span className='label'> {t('Name')} </span>
                            <span className='text'> {state.sure_name} </span>
                        </div>
                        <div className='detail'>
                            <span className='label'> {t('Email')} </span>
                            <span className='text'> {state.username} </span>
                        </div>
                        <div className='detail'>
                            <span className='label'> {t('Membership')} </span>
                            <span className='text'> {membership} </span>
                        </div>
                        <div className='membership-content'>
                            {
                                description && description.map((item, index) => (
                                    <li key={index}> {item.text} </li>
                                ))
                            }
                        </div>
                        <div className='detail'>
                            <span className='label'> {t('Roles')} </span>
                            <span className='text'> {role} </span>
                        </div>
                        <div className='detail'>
                            <span className='label'> {t('Phone')} </span>
                            <span className='text'> {state.phone} </span>
                        </div>
                    </div>

                </div>
            </div>
            <div className='content'>
                <div className='information w-60'>
                    <div className='header'>
                        {t('Gyms Information')}
                    </div>
                    <hr />
                    <div className='details' style={{ flexDirection: 'row' }}>
                        <span className='w-60' style={{ marginTop: '10px' }}>
                            <div className='labelInput'>
                                <span className='text'> {'Trade license number :'} </span>
                                {!gymInfo ?
                                    <input className={tradeLicenseNumberError ? "input error" : "input"}
                                        value={tradeLicenseNumber}
                                        onChange={e => {
                                            setTradeLicenseNumber(e.target.value);
                                            // console.log(e.currentTarget.value);
                                        }}
                                    />
                                    :
                                    <span className='label'>{gymInfo.tradeLicenseNumber}</span>
                                }
                            </div>
                            <div className='labelInput'>
                                <span className='text'> {'Company Name :'} </span>
                                {!gymInfo ?
                                    <input className={companyNameError ? "input error" : "input"}
                                        value={companyName}
                                        onChange={e => {
                                            setCompanyName(e.target.value);
                                        }}
                                    /> :
                                    <span className='label'>{gymInfo.name}</span>
                                }
                            </div>
                        </span>
                        <ReactImageUploading
                            value={GymImage}
                            onChange={
                                (imageList, addUpdateIndex) =>
                                    onChange(
                                        setGymImages,
                                        imageList,
                                        addUpdateIndex
                                    )
                            }
                            dataURLKey="data_url"
                        >

                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps
                            }) => {
                                return (
                                    <div className='image-content' style={{ padding: 10, flex: '1', margin: 0 }} {...dragProps}>
                                        {GymImage.length === 0 &&
                                            (saveGymImage ?
                                                <img src={saveGymImage} alt="" className='gym-image' /> :
                                                <div className='gym-image'></div>
                                            )}
                                        {GymImage.map((image, index) => (
                                            <React.Fragment key={index}>
                                                <img src={image.data_url} alt="" className='gym-image' />

                                                <div className="image-item__btn-wrapper">
                                                    <div className='update-btn' onClick={() => onImageUpdate(index)}>
                                                        <MdChangeCircle />
                                                    </div>
                                                    <div className='delete-btn' onClick={() => onImageRemove(index)}>
                                                        <MdDelete />
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        ))}

                                        {
                                            GymImage.length === 0 &&

                                            <button className='button active' onClick={onImageUpload}>
                                                {t('Select')}
                                            </button>
                                        }

                                        {
                                            GymImage.length !== 0 &&

                                            <button
                                                className='button active'
                                                onClick={() =>
                                                    uploadGymImage()
                                                }
                                            >
                                                {t('Upload')}
                                            </button>
                                        }
                                        {
                                            uploadingG &&
                                            <div className='overlay'>
                                                {t('Uploading image...')}
                                            </div>
                                        }
                                    </div>

                                );
                            }}
                        </ReactImageUploading>
                    </div>
                    <button
                        className='btn active'
                        onClick={() => { onSubmits() }}
                    >
                        Submits
                    </button>
                </div>
                <div className='membershipCardImage'>
                    <div className='details'>
                        <ReactImageUploading
                            value={MembershipImage}
                            onChange={
                                (imageList, addUpdateIndex) =>
                                    onChange(
                                        setMembershipImages,
                                        imageList,
                                        addUpdateIndex
                                    )
                            }
                            dataURLKey="data_url"
                        >

                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps
                            }) => {
                                return (
                                    <div className='image-content' style={{ padding: 10, flex: '1', margin: 0 }} {...dragProps}>
                                        {MembershipImage.length === 0 &&
                                            (saveMembershipImage ?
                                                <img src={saveMembershipImage} alt="" className='imageContent' /> :
                                                <div className='imageContent'></div>
                                            )}
                                        {MembershipImage.map((image, index) => (
                                            <React.Fragment key={index}>
                                                <img src={image.data_url} alt="" className='imageContent' />

                                                <div className="image-item__btn-wrapper">
                                                    <div className='update-btn' onClick={() => onImageUpdate(index)}>
                                                        <MdChangeCircle />
                                                    </div>
                                                    <div className='delete-btn' onClick={() => onImageRemove(index)}>
                                                        <MdDelete />
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        ))}

                                        {
                                            MembershipImage.length === 0 &&

                                            <button className='button active' onClick={onImageUpload}>
                                                {t('Select')}
                                            </button>
                                        }

                                        {
                                            MembershipImage.length !== 0 &&

                                            <button
                                                className='button active'
                                                onClick={() =>
                                                    uploadMemberImage()
                                                }
                                            >
                                                {t('Upload')}
                                            </button>
                                        }
                                        {
                                            uploadingM &&
                                            <div className='overlay'>
                                                {t('Uploading image...')}
                                            </div>
                                        }
                                    </div>

                                );
                            }}
                        </ReactImageUploading>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Setting;