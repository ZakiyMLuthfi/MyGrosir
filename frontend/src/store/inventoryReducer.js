// src/store/reducers/inventoryReducer.js
const initialState = {
  products: { products: [] },
  suppliers: { suppliers: [] },
  stockIns: [],
  stockOuts: [],
  stockHistories: { stockHistories: [] },
  users: [],
  token: null,
  role: null,
  totalAssets: null,
  totalItems: null,
  totalOutgoing: null,
  totalIncoming: null,
  stockFlowData: [],
  recentStockHistory: [],
  lowStockNotifications: [],
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: { products: action.payload },
      };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: {
          ...state.products,
          products: state.products.products.filter(
            (product) => product.id !== action.payload
          ),
        },
      };

    case "SET_SUPPLIERS":
      return {
        ...state,
        suppliers: { suppliers: action.payload },
      };
    case "ADD_SUPPLIER":
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case "REMOVE_SUPPLIER":
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          suppliers: state.suppliers.suppliers.filter(
            (supplier) => supplier.id !== action.payload
          ),
        },
      };

    case "SET_STOCK_INS":
      return { ...state, stockIns: action.payload };
    case "ADD_STOCK_INS":
      return { ...state, stockIns: [...state.stockIns, action.payload] };

    case "SET_STOCK_OUTS":
      return { ...state, stockOuts: action.payload };
    case "ADD_STOCK_OUT":
      return { ...state, stockOuts: [...state.stockOuts, action.payload] };

    case "SET_STOCK_HISTORIES":
      return { ...state, stockHistories: { stockHistories: action.payload } };

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
      return {
        ...state,
        token: action.payload.token || "",
        role: action.payload.role || "",
        userId: action.payload.userId || "", // Menyimpan role dari payload
      };

    case "CLEAR_TOKEN":
      return {
        ...state,
        token: "",
        role: "",
        userId: "",
        // Menghapus role saat logout
      };

    case "SET_TOTAL_ASSETS":
      return { ...state, totalAssets: action.payload };

    case "SET_TOTAL_ITEMS":
      return { ...state, totalItems: action.payload };

    case "SET_TOTAL_OUTGOING":
      return { ...state, totalOutgoing: action.payload };

    case "SET_TOTAL_INCOMING":
      return { ...state, totalIncoming: action.payload };

    case "SET_STOCK_FLOW_DATA":
      return { ...state, stockFlowData: action.payload };

    case "SET_RECENT_STOCK_HISTORY":
      return { ...state, recentStockHistory: action.payload };

    case "SET_LOW_STOCK_NOTIFICATIONS":
      return { ...state, lowStockNotifications: action.payload };

    default:
      return state;
  }
};

export default inventoryReducer;
