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
import SettingsApplicationsOutlined from '@material-ui/icons/SettingsApplicationsOutlined';
import HistoryOutlined from '@material-ui/icons/HistoryOutlined';

// core components/views for Admin layout
import AccountsListPage from 'views/AccountsList/AccountsList.js';
import TransactionHistoryPage from 'views/TransactionHistory/TransactionHistory.js';
import SettingPage from 'views/Setting/Setting.js';

const dashboardRoutes = [
  {
    path: "/home",
    name: "Danh sách tài khoản",
    icon: LibraryBooks,
    component: AccountsListPage,
  },
  {
    path: "/history-transactions",
    name: "Lịch sử giao dịch",
    icon: HistoryOutlined,
    component: TransactionHistoryPage,
  },
  {
    path: "/setting",
    name: "Cài đặt",
    icon: SettingsApplicationsOutlined,
    component: SettingPage,
  },
];

export default dashboardRoutes;