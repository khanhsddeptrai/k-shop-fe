import Home from "../pages/Home/Home"
import Product from "../pages/Products/Product"
import Order from "../pages/Order/Order"
import NotFound from "../pages/NotFound/NotFound"
import TypeProducts from "../pages/TypeProducts/TypeProducts"
import ProductDetail from "../pages/ProductDetail/ProductDetail"
import SignIn from "../pages/SignIn/SignIn"
import SignUp from "../pages/SignUp/SignUp"
import Profile from "../pages/Profile/Profile"
import Admin from "../pages/Admin/Admin"
import Cart from "../pages/Cart/Cart"
import Checkout from "../pages/Checkout/Checkout"
import MyOrder from "../pages/MyOrder/MyOrder"
import OrderDetail from "../pages/OrderDetail/OrderDetail"
import SearchResult from "../pages/SearchResult/SearchResult"
import HeaderTest from "../pages/HeaderTest"

export const routes = [
    {
        path: "/",
        page: Home,
        isShowHeader: true
    },
    {
        path: "/products",
        page: Product,
        isShowHeader: true
    },
    {
        path: "/search",
        page: SearchResult,
        isShowHeader: true
    },
    {
        path: "/orders",
        page: Order,
        isShowHeader: true
    },
    {
        path: "/cart",
        page: Cart,
        isShowHeader: true
    },
    {
        path: "/my-order",
        page: MyOrder,
        isShowHeader: true
    },
    {
        path: "/detail/:id",
        page: OrderDetail,
        isShowHeader: true
    },
    {
        path: "/CheckOut",
        page: Checkout,
        isShowHeader: true
    },
    {
        path: "/category/:categoryId",
        page: TypeProducts,
        isShowHeader: true
    },
    {
        path: "/sign-in",
        page: SignIn,
        isShowHeader: false
    },
    {
        path: "/sign-up",
        page: SignUp,
        isShowHeader: false
    },
    {
        path: "/profile",
        page: Profile,
        isShowHeader: true
    },
    {
        path: "/product-detail/:id",
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path: "/test",
        page: HeaderTest,
        isShowHeader: true
    },
    {
        path: "/system/admin*",
        page: Admin,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page: NotFound
    }
]