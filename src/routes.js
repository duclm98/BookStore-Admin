/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import HistoryOutlined from "@material-ui/icons/HistoryOutlined";
import PeopleAltOutlined from "@material-ui/icons/PeopleAltOutlined";

// core components/views for Admin layout
import AccountsListPage from "views/AccountsList/AccountsList.js";
import CategoriesPage from "views/Categories/Categories.js";

const dashboardRoutes = [
  {
    path: "/home",
    name: "Danh sách tài khoản",
    icon: PeopleAltOutlined,
    component: AccountsListPage,
  },
  {
    path: "/categories",
    name: "Danh mục sách",
    icon: LibraryBooks,
    component: CategoriesPage,
  },
  // {
  //   path: "/posts",
  //   name: "Bài đăng",
  //   icon: HistoryOutlined,
  //   component: TransactionHistoryPage,
  // },
];

export default dashboardRoutes;
