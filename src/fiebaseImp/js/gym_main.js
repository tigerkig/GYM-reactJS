import firebase, { auth, db } from '../main';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    collectionGroup,
    query,
    arrayUnion,
    arrayRemove,
    where,
    limit
} from 'firebase/firestore';

const collectionName = "gym_main";

export const getGymInfo = (id) => {
    return getDoc(doc(db, collectionName, id))
        .then(data => {
            console.log(data.data())
            return data.data();
        })
}

export const createGymId = () => {
    return addDoc(collection(db, collectionName), {})
        .then((data) => {
            return { id: data.id };
        })
        .catch((error) => {
            console.log(error);
        })
}

export const saveGymInfo = async (id, name, number, path) => {
    const state = JSON.parse(localStorage.getItem('profile'));

    await setDoc(doc(db, collectionName, id), {
        name: name,
        owner: state.id,
        // users: state.id,
        tradeLicenseNumber: number,
        tradeLicenseFilePath: path,
        approved: false
    }).then(() => {
        // return { success: 'success', error: '' };
    }).catch((error) => {
        return { error: error.message, success: '' };
    })

    await updateDoc(doc(db, 'users', state.id), { gymInfo: id })
        .then(() => {

        }).catch((err) => {
            return { error: err.message, success: '' };
        })

    return { success: 'success', error: '' };
}
