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

export function getUsers(){
    return dispatch => {
        firebase.database().ref(`/users`).on('value', snap => {
            let users = [];
            let data = snap.val();
            for(let key in data){
                if(data[key]['Admin']){
                    // console.log(data[key]['Admin']);
                }else{
                    users.push(data[key]);
                }
            };
            dispatch({type: ActionTypes.GETUSERS, payload: users});
        })
    };
};
export function deleteUser(UID){
    return dispatch => {
        firebase.database().ref(`/users/${UID}`).remove();
        firebase.database().ref(`/auction/`).on('value', snap => {
            let data = snap.val();
            let keys = [];
            for(let key in data){
                if(data[key]['UID'] === UID){
                    keys.push(key);
                }
            };
            for(let i=0; i<keys.length; i++){
                firebase.database().ref(`/auction/${keys[i]}`).remove();
            };
        });
    };
};
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
                // console.log(flag);
                if(flag){
                    // console.log(flag);
                    return alert('You are already apply bid...');
                }else if(flag === false){
                    // console.log(flag);                
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
export function deleteAuction(key){
    return dispatch => {
        firebase.database().ref(`/auction/${key}`).remove();
    };
};
export function signupAction(usr) {
    // console.log(usr);
    return dispatch => {
        firebase.auth().createUserWithEmailAndPassword(usr.email, usr.password)
        .then((userObj) => {
            localStorage.setItem('type', JSON.stringify('/home'));        
            let name = usr.userName;
                let user = {
                    name: usr.userName,
                    uid: userObj.uid,
                    email: userObj.email, 
                    Admin: false,
                };
                // console.log('signed up successfully', user);
                firebase.database().ref(`users/${user.uid}/`).set({email: user.email, UID: user.uid, name, Admin: false});
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
        // console.log('user in signin', user);
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userObj) => {
                // console.log(userObj);
                firebase.database().ref(`/users/${userObj.uid}`).on('value', snap => {
                    let data = snap.val();
                    if(data){
                        localStorage.setItem('type', JSON.stringify('/home'));        
                        let user = {
                            uid: userObj.uid,
                            email: userObj.email,
                            name: userObj.displayName,
                        };
                        // console.log(user);
                        dispatch({type: ActionTypes.SIGNIN, payload: user,})
                        history.push('/Home');
                        // console.log('then');
                    }else{
                        userObj.delete().then(() => {
                            dispatch({type: ActionTypes.ERROR, payload: 'delete by Admin'});
                        })
                        dispatch({type: ActionTypes.ERROR, payload: 'delete by Admin'});                           
                    }
                })
            })
        .catch((error) => {
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
            // let imgName = obj.img.name;
            // // obj.imgPath = imgName; 
            // console.log(obj.img);
            firebase.storage().ref(`/images/${UID}/${new Date().getTime()}`).put(obj.img)
                .then((snap) => {
                    obj.pic = snap.metadata.downloadURLs[0];
                    firebase.database().ref(`/auction/`).push(obj);
                    // console.log(ad);
                })
                .catch((error) => {
                    console.log(error);
                });
            // console.log(path);
        });
    };
};

export function logoutAction(){
    return dispatch => {
        // console.log('userLogout');
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
            if(user){
                    let UID = user.uid;
                    firebase.database().ref(`users/${UID}/`).on('value', snap => {
                    // console.log(snap.val());
                    let data = snap.val();
                    dispatch({type: ActionTypes.GETUSERNAME, payload: data})
                })
            }
        });
    };
};

