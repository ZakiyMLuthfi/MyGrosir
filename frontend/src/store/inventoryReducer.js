// src/store/reducers/inventoryReducer.js
const initialState = {
  products: [],
  suppliers: [],
  stockIns: [],
  stockOuts: [],
  stockHistories: [],
  users: [],
  token: null,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };

    case "SET_SUPPLIERS":
      return { ...state, suppliers: action.payload };
    case "ADD_SUPPLIER":
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case "REMOVE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.filter(
          (supplier) => supplier.id !== action.payload
        ),
      };

    case "SET_STOCK_INS":
      return { ...state, stockIns: action.payload };
    case "ADD_STOCK_INS":
      return { ...state, stockIns: [...state.stockIns, action.payload] };

    case "SET_STOCK_OUTS":
      return { ...state, stockOuts: action.payload };

    case "SET_STOCK_HISTORIES":
      return { ...state, stockHistories: action.payload };

    case "SET_USERS":
      return { ...state, users: action.payload };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "CLEAR_TOKEN":
      return { ...state, token: null };

    default:
      return state;
  }
};

export default inventoryReducer;
