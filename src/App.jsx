
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import './App.css'
import { CartProvider, CartContext } from "./Components/CartContext/CartContext"
import ProtectedRoute from './Components/UserProtected/UserProtected';

import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'

import Store from './Components/Store/Store'
import Cart from './Components/Cart/Cart'
import ProductDesc from './Components/ProductDesc/ProductDesc'
import Checkout from './Components/Checkout/Checkout'
import Orders from './Components/Orders/Orders'
import Order from './Components/Order/Order'
import Wishlist from './Components/Wishlist/Wishlist'

import Admin from './Components/Admin-Component/Admin';
import Dashboard from './Components/Admin-Component/DashBoard/Dashboard';

function AppRoutes() {
  const { user, userLoaded } = useContext(CartContext);
  if (!userLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={
        user ? (
          <Navigate to={'admin' ? '/admin' : '/'} />) :
          (<Login />)
      }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/store"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Store />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ProductDesc />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {


  return (
    <CartProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
    </CartProvider>

  );
}

export default App