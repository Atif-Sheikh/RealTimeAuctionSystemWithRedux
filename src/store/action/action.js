import ActionTypes from '../constant/constant';
import history from '../../History';
import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD5gclkuNj__pVuSfgkWvCWnzxtRrpA6rw",
    authDomain: "realtimeauctionsystem.firebaseapp.com",
    databaseURL: "https://realtimeauctionsystem.firebaseio.com",
    projectId: "realtimeauctionsystem",
    storageBucket: "realtimeauctionsystem.appspot.com",
    messagingSenderId: "395103837943"
  };
  firebase.initializeApp(config);

export function getBidders(key){
    return dispatch => {
        // console.log(key);
        firebase.database().ref(`/biddings/${key}/`).on('value', snap => {
            let data = snap.val();
            let bidders = [];
            for(let key in data){
                bidders.push(data[key]);
            }
            dispatch({type: ActionTypes.GETBIDDERS, payload: bidders});
        })
    };
};
export function submitBid(bid, bidder, pushKey, UID){
    return dispatch => {
        // console.log(bid, bidder, pushKey, UID);
        let flag = false;        
        firebase.database().ref(`/biddings/${pushKey}/`).once('value')
            .then((snap) => {
                let obj = snap.val();
                for(let key in obj){
                    // console.log(UID, obj[key].UID);
                    if(UID === obj[key].UID){
                        flag = true;
                        break;
                    }
                };
                console.log(flag);
                if(flag){
                    console.log(flag);
                    return alert('You are already apply bid...');
                }else if(flag === false){
                    console.log(flag);                
                    firebase.database().ref(`/biddings/${pushKey}/`).push({UID, bid, bidder}).then(() => {
                        return alert('successfully apply bid...');
                    });
                };
            });
        };
    };
export function getData(){
    return dispatch => {
        firebase.database().ref(`/auction`).on('value', snap => {
            let data = snap.val();
            let keys = [];
            let dataArray = []; 
            for(let key in data){
                // console.log(data[key]['date']);
                dataArray.push(data[key]);
                keys.push(key);
            };
            // console.log(dataArray);
            dispatch({type: ActionTypes.GETDATA, payload: dataArray});
            dispatch({type: ActionTypes.GETKEYS, payload: keys});
        });
    };
};

export function signupAction(usr) {
    console.log(usr);
    return dispatch => {
        firebase.auth().createUserWithEmailAndPassword(usr.email, usr.password)
        .then((userObj) => {
            let name = usr.userName;
                let user = {
                    name: usr.userName,
                    uid: userObj.uid,
                    email: userObj.email, 
                };
                // console.log('signed up successfully', user);
                firebase.database().ref(`users/${user.uid}/`).set({email: user.email, UID: user.uid, name});
                dispatch({ type: ActionTypes.SIGNUP, payload: user })
                history.push('/home');
            }).catch((error) => {
                console.log(error.message);
                dispatch({ type: ActionTypes.SIGNUPERROR, payload: error.message });
            });
    };
};

export function signinAction(user) {
    return dispatch => {
        console.log('user in signin', user);
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((userObj) => {
                let user = {
                    uid: userObj.uid,
                    email: userObj.email,
                    name: userObj.displayName,
                };
                // console.log(user);
                dispatch({type: ActionTypes.SIGNIN, payload: user,})
                history.push('/Home');
                // console.log('then');
            }).catch((error) => {
                console.log(error.message);                
                dispatch({ type: ActionTypes.ERROR, payload: error.message});
        });
    };
};
export function submitData(obj){
    return dispatch => {
        firebase.auth().onAuthStateChanged((user) => {
            let UID = user.uid;
            obj.UID = UID;
            console.log(obj);
            firebase.database().ref(`/auction/`).push(obj);
        });
    };
};

export function logoutAction(){
    return dispatch => {
        console.log('userLogout');
        firebase.auth().onAuthStateChanged((user) => {
            firebase.auth().signOut()
                .then(() => {
                    localStorage.clear();
                    history.push('/');
                })
                .catch((error) => {
                    console.log(error);
            });            
        });
    };
};

export function getUserName(){
    return dispatch => {
        firebase.auth().onAuthStateChanged((user) => {
            let UID = user.uid;
            firebase.database().ref(`users/${UID}/`).on('value', snap => {
                // console.log(snap.val());
                let data = snap.val();
                dispatch({type: ActionTypes.GETUSERNAME, payload: data})
            })
        });
    };
};

