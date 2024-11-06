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
  const products = useSelector((state) => state.inventory.products || []);
  console.log("Fetched products from Redux:", products);
  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);
  console.log("Role right now: ", role);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

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
    console.log("Fetching products...");
    console.log("Current Page:", currentPage);
    console.log("Items Per Page:", itemsPerPage);
    try {
      const totalPagesFromApi = await fetchProducts(
        currentPage,
        itemsPerPage,
        dispatch
      );
      console.log("Total Pages from API:", totalPagesFromApi);
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

    if (storedRole && !role && storedToken) {
      dispatch(setToken({ token: storedToken, role: storedRole }));
    }
  }, [dispatch, role]);

  useEffect(() => {
    if (role) {
      fetchAndSetProducts();
    }
  }, [role, currentPage, itemsPerPage]);

  const handleDeleteClick = async (product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${product.product_name}?`
    );
    if (confirmDelete) {
      try {
        await deleteProductService(product.id, dispatch);
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  const handleToggleDelete = async (product) => {
    if (product.isDeleted) {
      await restoreProductService(product.id, dispatch);
    } else {
      await deleteProductService(product.id, dispatch);
    }
    fetchAndSetProducts();
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
    try {
      await addProductService(formData, dispatch);
      setShowModal(false);
      await fetchAndSetProducts();
    } catch (err) {
      console.error("Error adding product", err);
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
          {role === "admin" && (
            <TableAction
              type="product"
              onAdd={handleAddProduct}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          <div className="product-table mb-4">
            <ProductTable
              products={sortedProducts}
              onDetailClick={handleDetailClick}
              onDeleteClick={handleDeleteClick}
              onSort={handleSort}
              onToggleClick={handleToggleDelete}
              sortConfig={sortConfig}
            />
          </div>

          {/* Tombol Active Status hanya untuk Superadmin */}
          {role === "superadmin" && (
            <button onClick={() => handleToggleDelete(products)}>
              Active Status
            </button>
          )}

          {/* Tombol Delete hanya untuk Admin */}
          {role === "admin" && (
            <button onClick={() => handleDeleteClick(products)}>
              Delete Product
            </button>
          )}

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />

          <ProductDetailModal
            show={showModal}
            onClose={handleCloseModal}
            productData={selectedProduct}
            isEditing={isEditing}
            onUpdate={handleSaveChanges}
            onToggleEdit={handleUpdateClick}
            users={users}
          />
        </div>
      )}
    </>
  );
};

export default ProductPage;
