import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductDetail,
  updateProduct,
  addProductService,
  deleteProductService,
  restoreProductService,
} from "../../services/productService";
import ErrorToast from "../../utils/ErrorToast";
import { fetchUsers } from "../../services/userServices";
import { setToken } from "../../reducers/userActions";
import debounce from "lodash.debounce";
import ProductDetailModal from "../modals/productDetailModal";
import ProductTable from "../tables/ProductTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";
import "../css/Table.css";

const ProductPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.inventory.products.products || []
  );
  console.log("products dari redux:", products);

  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchProducts(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedProducts = React.useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    let sortableProducts = [...products];
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Memanggil all product
  const fetchAndSetProducts = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchProducts(
        currentPage,
        itemsPerPage,
        dispatch
      );
      console.log(
        "setTotalPages(totalPagesFromApi) adalah: ",
        totalPagesFromApi
      );

      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  const fetchAndSetUsers = useCallback(async () => {
    try {
      const response = await fetchUsers(currentPage, itemsPerPage, dispatch);
      if (response.users) {
        dispatch(setUsers(response.users));
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    const storedRole = localStorage.getItem("accessRole");
    const storedToken = localStorage.getItem("accessToken");
    const storedId = localStorage.getItem("loggedInUserId");

    if (storedRole && storedToken && !role) {
      dispatch(
        setToken({ token: storedToken, role: storedRole, userId: storedId })
      );
    }
  }, [dispatch, role]);

  useEffect(() => {
    if (role) {
      fetchAndSetProducts();
    }
  }, [role, currentPage, itemsPerPage]);

  const handleToggleDelete = async (product) => {
    if (product.isDeleted) {
      await restoreProductService(product.id, dispatch);
    } else {
      await deleteProductService(product.id, dispatch);
    }
    // Memastikan data produk selalu terupdate
    await fetchAndSetProducts();
  };

  const handleDetailClick = async (product) => {
    try {
      const productDetail = await fetchProductDetail(product.id);
      setSelectedProduct(productDetail);
      setShowModal(true);
      await fetchAndSetUsers();
    } catch (error) {
      console.error("Error fetching product detail:", error);
      alert("Failed to load product details. Please try again later.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleAddProduct = async (formData) => {
    if (
      !formData.product_name.trim() ||
      !formData.package_quantity ||
      !formData.weight_type.trim() ||
      !formData.weight_per_pkg
    ) {
      setErrorMessage("Please fill in all required fields."); // Set error message
      return;
    }

    try {
      await addProductService(formData, dispatch);
      setShowModal(false);
      await fetchAndSetProducts();
    } catch (err) {
      console.error("Error adding product", err);
      setErrorMessage("Failed to add product. Please try again.");
    }
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleSaveChanges = async (updatedProductData) => {
    try {
      await updateProduct(selectedProduct.id, updatedProductData);
      // Memastikan data produk selalu terupdate setelah perubahan
      await fetchAndSetProducts();
      handleCloseModal(); // Menutup modal dan reset state
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Product List</h1>

          {/* Hanya admin yang bisa menambah dan mencari produk */}
          <TableAction
            type="product"
            onAdd={handleAddProduct}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            role={role}
          />

          <div className="product-table mb-4">
            <ProductTable
              products={sortedProducts}
              onDetailClick={handleDetailClick}
              onSort={handleSort}
              onToggleClick={handleToggleDelete}
              sortConfig={sortConfig}
              role={role}
            />
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />

          {/* Modal detail produk */}
          <ProductDetailModal
            show={showModal}
            onClose={handleCloseModal}
            productData={selectedProduct}
            isEditing={isEditing}
            onUpdate={handleSaveChanges}
            onToggleEdit={handleUpdateClick}
            users={users}
            role={role}
          />
        </div>
      )}

      {errorMessage && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </>
  );
};

export default ProductPage;
