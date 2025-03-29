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
        path: "/orders",
        page: Order,
        isShowHeader: true
    },
    {
        path: "/type",
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
        path: "/product-detail",
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path: "/system/admin",
        page: Admin,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page: NotFound
    }
]