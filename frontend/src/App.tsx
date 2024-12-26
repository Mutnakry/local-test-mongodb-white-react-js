// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from './components/CategoryList.tsx';
import CategoryForm from './components/CategoryForm.tsx';
import CreateCategory from './components/CategoryForm.tsx'
import ProductList from './components/product/productList.tsx'
import CreateProduct from './components/product/CreateProduct.tsx';
import UpdateProduct from './components/product/UpdateProduct.tsx'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/categories" element={<CreateCategory />} />
        <Route path="/product" element={<CreateProduct />} />
        <Route path="/product/:id" element={<UpdateProduct />} />


        <Route path="/categories/:id" element={<CategoryForm />} />
      </Routes>
    </Router>
  );
};

export default App;
