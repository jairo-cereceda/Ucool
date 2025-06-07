// import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PanelVenta from "./pages/main/venta";
import Login from "./pages/user/login";
import Registro from "./pages/user/registro";
import PanelHome from "./pages/main/home";
import PanelContacto from "./pages/information/contacto";
import PanelAyuda from "./pages/information/ayuda";
import PanelSuscripcion from "./pages/user/suscripcion";
import PanelAdministrarProductos from "./pages/main/administrarProductos";
import AgregarProducto from "./pages/main/agregarProducto";
import PanelSettings from "./pages/settings/settings";
import PanelVistaProducto from "./pages/main/vistaProducto";
import PanelPerfil from "./pages/user/perfil";
import PanelEditarPerfil from "./pages/user/editarPerfil";
import PanelMetricas from "./pages/metrics/metricas";
import RegistroEstablecimiento from "./pages/user/registroEstablecimiento";
import VerificarCuenta from "./pages/user/verificarCuenta";
import PanelAdministrarCategorias from "./pages/main/administrarCategorias";
import PanelAdministrar from "./pages/main/administrar";
import AgregarCategoria from "./pages/main/agregarCategoria";
import EsperaVerificar from "./pages/user/esperaVerificacion";
import PanelEditarCategoria from "./pages/main/editarCategoria";
import { PrivateRouteVerified } from "./components/security/privateRoute";
import { PublicRoute } from "./components/security/publicRoute";
import { AdministradorRoute } from "./components/security/administratorRoute";
import PanelAdministrarCompras from "./pages/main/administrarCompras";
import PanelAdministrarGastosOperativos from "./pages/main/administrarGastosOperativos";
import PanelEditarCompra from "./pages/main/editarCompra";
import PanelEditarGastoOperativo from "./pages/main/editarGastoOperativo";
import PanelPagos from "./pages/main/pagos";
import PanelAdministrarProveedores from "./pages/main/administrarProveedores";
import PanelEditarProveedores from "./pages/main/editarProveedores";
import PanelAdministrarVentas from "./pages/main/administrarVentas";
import PanelAdministrarDevoluciones from "./pages/main/administrarDevoluciones";
import AgregarDevolucion from "./pages/main/agregarDevolucion";
import PanelEnviarMailPass from "./pages/user/enviarMailPassword";
import PanelCambiarPass from "./pages/user/cambiarPass";
import PanelAdministrarUsuarios from "./pages/main/administrarUsuarios";
import PanelEditarUsuarios from "./pages/main/editarUsuarios";

export default function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return (
    <Router>
      <>
        <ToastContainer />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            <Route
              path="/register-establecimiento"
              element={<RegistroEstablecimiento />}
            />
            <Route
              path="/enviar-cambiar-pass"
              element={<PanelEnviarMailPass />}
            />
            <Route path="/cambiar-pass" element={<PanelCambiarPass />} />
          </Route>
          <Route path="/espera-verificar" element={<EsperaVerificar />} />
          <Route path="/verificar-cuenta" element={<VerificarCuenta />} />

          <Route element={<PrivateRouteVerified />}>
            <Route path="/" element={<PanelHome />} />
            <Route element={<AdministradorRoute />}>
              <Route path="/administrar" element={<PanelAdministrar />} />
              <Route
                path="/administrar-categoria"
                element={<PanelAdministrarCategorias />}
              />
              <Route
                path="/administrar-categoria/:id"
                element={<PanelAdministrarProductos />}
              />
              <Route
                path="/administrar-categoria/:id/edit"
                element={<PanelEditarCategoria />}
              />
              <Route
                path="/administrar-categoria/:id/agregar-producto"
                element={<AgregarProducto />}
              />
              <Route path="/agregar-categoria" element={<AgregarCategoria />} />
              <Route path="/administrar-pagos" element={<PanelPagos />} />
              <Route
                path="/administrar-compras"
                element={<PanelAdministrarCompras />}
              />

              <Route
                path="/administrar-compras/:id/editar"
                element={<PanelEditarCompra />}
              />
              <Route
                path="/administrar-gastos-operativos"
                element={<PanelAdministrarGastosOperativos />}
              />
              <Route
                path="/administrar-gastos-operativos/:id/editar"
                element={<PanelEditarGastoOperativo />}
              />
              <Route
                path="/administrar-proveedores"
                element={<PanelAdministrarProveedores />}
              />
              <Route
                path="/administrar-proveedores/:id/editar"
                element={<PanelEditarProveedores />}
              />

              <Route
                path="/administrar-usuarios"
                element={<PanelAdministrarUsuarios />}
              />
              <Route
                path="/administrar-usuarios/:id/editar"
                element={<PanelEditarUsuarios />}
              />
              <Route
                path="/vista-producto/:id"
                element={<PanelVistaProducto />}
              />

              <Route
                path="/vista-producto/:id/edit"
                element={<PanelVistaProducto activePanel={"Edicion"} />}
              />
            </Route>

            <Route path="/configuracion" element={<PanelSettings />} />

            <Route path="/metricas" element={<PanelMetricas />} />
            <Route
              path="/administrar-ventas"
              element={<PanelAdministrarVentas />}
            />
            <Route
              path="/administrar-devoluciones"
              element={<PanelAdministrarDevoluciones />}
            />
            <Route path="/crear-devolucion" element={<AgregarDevolucion />} />

            <Route path="/vender" element={<PanelVenta />} />
            <Route path="/perfil" element={<PanelPerfil />} />
            <Route path="/perfil/editar" element={<PanelEditarPerfil />} />
          </Route>

          <Route path="/contacto" element={<PanelContacto />} />
          <Route path="/ayuda" element={<PanelAyuda />} />

          <Route
            path="/suscripcion"
            element={
              <Elements stripe={stripePromise}>
                <PanelSuscripcion />
              </Elements>
            }
          />
        </Routes>
      </>
    </Router>
  );
}
