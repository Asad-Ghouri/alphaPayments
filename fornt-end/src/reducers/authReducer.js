// redux/reducers/authReducer.js
const authReducer = (state = {isAuth:false ,  UserId:""}, action) => {
    switch (action.type) {
      case 'LOGIN':
        
        return{        
            ...state,
        isAuth: true,
        UserId:action.UserId,
        }
      default:
        return state;
    }
  };
  
  export default authReducer;
  