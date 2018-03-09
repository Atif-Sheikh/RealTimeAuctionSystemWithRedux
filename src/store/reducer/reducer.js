import ActionTypes from '../constant/constant';

const INITIAL_STATE = {
    user: {},
    data: [],
    keys: [],
    currentUser: '',
    error: '',
    signupError: '',
    UID: '',
    bidders: [],
    users: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ActionTypes.CURRENTUSER:
            return ({
                ...state,
                currentUser: action.payload
            });
        case ActionTypes.GETUSERS:
            return ({
                ...state,
                users: action.payload,
            });
        case ActionTypes.GETBIDDERS: 
            return ({
                ...state,
                bidders: action.payload,
            });
        case ActionTypes.SIGNUP:
            return ({
                user: action.payload,
            });
        case ActionTypes.ERROR:
            return ({
                ...state,
                error: action.payload,
            });
        case ActionTypes.SIGNUPERROR: 
            return ({
                ...state,
                signupError: action.payload,
            }); 
        case ActionTypes.SIGNIN: 
            return ({
                user: action.payload,
            });  
        case ActionTypes.GETUSERNAME: 
            return ({
                ...state,
                user: action.payload,
            })
        case ActionTypes.SUBMITDATA:
            return ({
                ...state,
            })
        case ActionTypes.GETDATA:
            return ({
                ...state,
                data: action.payload,
            })
        case ActionTypes.GETKEYS: 
            return ({
                ...state,
                keys: action.payload,
            })     
        default:
            return state;
    }
};