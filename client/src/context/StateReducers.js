import { reducerCases } from "./constants";

export const initialState = {
  userInfo: null,
  showLoginModal: false,
  showSignupModal: false,
  isSeller: Boolean,
  gigData: undefined,
  hasOrdered: false,
  reloadReviews: false,
  categorys: [],
  popularCategs: [],
  wishList:[],
  sellerNotif : [],
  userMessage : [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.TOGGLE_LOGIN_MODAL:
      return {
        ...state,
        showLoginModal: action.showLoginModal,
      };
    case reducerCases.TOGGLE_SIGNUP_MODAL:
      return {
        ...state,
        showSignupModal: action.showSignupModal,
      };
    case reducerCases.CLOSE_AUTH_MODAL:
      return {
        ...state,
        showSignupModal: false,
        showLoginModal: false,
      };
    case reducerCases.SWITCH_MODE:
      return {
        ...state,
        isSeller: action.payload,
      };
    case reducerCases.SET_GIG_DATA:
      return {
        ...state,
        gigData: action.gigData,
      };
    case reducerCases.HAS_USER_ORDERED_GIG:
      return {
        ...state,
        hasOrdered: action.hasOrdered,
      };
      case reducerCases.ADD_REVIEW:
        return {
          ...state,
          gigData: {
            ...state.gigData,
            reviews: [...state.gigData.reviews, action.newReview],
          },
        };
        case reducerCases.GET_CATEGORYS:
          return {
            ...state,
            categorys: action.payload.categorys,
          };
        case reducerCases.GET_POPULAR_CATEGORYS:
          return {
            ...state,
            popularCategs: action.payload.polularCategorys,
          };
          case reducerCases.ADD_GIG_WISH_LIST:
            return {
              ...state,
              wishList: action.payload
            }
          case reducerCases.GET_SELLER_ORDERSNOTIF:
            return {
              ...state,
              sellerNotif: action.payload
            }
          case reducerCases.GET_USER_MESSAGE_NOTIF:
            return {
              ...state,
              userMessage: action.payload
            }
    default:
      return state;
  }
};

export default reducer;
