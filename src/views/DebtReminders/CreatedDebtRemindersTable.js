import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import PaymentIcon from "@material-ui/icons/Payment";
import FilterListIcon from "@material-ui/icons/FilterList";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import { debtRemindersAction, transactionAction } from "../../redux";

const headCells = [
  { id: "_id", numeric: false, disablePadding: true, label: "ID" },
  {
    id: "srcAccountNumber",
    numeric: true,
    disablePadding: false,
    label: "Số tài khoản chủ nợ",
  },
  {
    id: "srcAccountName",
    numeric: true,
    disablePadding: false,
    label: "Tên tài khoản chủ nợ",
  },
  { id: "debtMoney", numeric: true, disablePadding: false, label: "Số tiền" },
  {
    id: "debtContent",
    numeric: true,
    disablePadding: false,
    label: "Nội dung",
  },
  {
    id: "datetime",
    numeric: true,
    disablePadding: false,
    label: "Ngày giờ tạo",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    dispatch,
    selected,
    tablename,
    setOpen,
    setOpen1,
    setInputPayment,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tablename}
        </Typography>
      )}

      {numSelected > 0 ? (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Hủy nhắc nợ">
            <IconButton
              aria-label="delete"
              onClick={() => {
                setOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thanh toán nhắc nợ">
            <IconButton
              aria-label="delete"
              onClick={async () => {
                const debtReminders = await dispatch(
                  debtRemindersAction.detail(selected[0])
                );
                if (debtReminders.status && debtReminders.data) {
                  setInputPayment((prev) => ({
                    ...prev,
                    srcAccountNumber: debtReminders.data.srcAccountNumber,
                    desAccountNumber: debtReminders.data.desAccountNumber,
                    desAccountName: debtReminders.data.desAccountName,
                  }));
                  setOpen1(true);
                }
              }}
            >
              <PaymentIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const EnhancedTable = (props) => {
  const { dispatch, rows, tablename } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [inputRemoving, setInputRemoving] = useState({
    content: "",
    status: "",
  });

  const [inputPayment, setInputPayment] = useState({
    srcAccountNumber: "",
    desAccountNumber: "",
    desAccountName: "",
    content: "",
    status: "",
    otp: "",
  });

  const handleClose = () => {
    setInputRemoving({
      content: "",
      status: "",
    });
    setOpen(false);
  };

  const handleClose1 = () => {
    setInputPayment({
      srcAccountNumber: "",
      desAccountNumber: "",
      desAccountName: "",
      content: "",
      status: "",
      otp: "",
    });
    setSelected([]);
    setOpen1(false);
  };

  const handleClose2 = () => {
    setInputPayment({
      srcAccountNumber: "",
      desAccountNumber: "",
      desAccountName: "",
      content: "",
      status: "",
      otp: "",
    });
    setSelected([]);
    setOpen2(false);
  };

  const handleClose3 = () => {
    setInputPayment({
      srcAccountNumber: "",
      desAccountNumber: "",
      desAccountName: "",
      content: "",
      status: "",
      otp: "",
    });
    setSelected([]);
    setOpen3(false);
  };

  const handleRemoveDebtReminders = async () => {
    if (inputRemoving.content === "") {
      return setInputRemoving((prev) => ({
        ...prev,
        content: "",
        status: "Vui lòng nhập đầy đủ thông tin cần thiết!",
      }));
    }
    const removeDebtReminders = await dispatch(
      debtRemindersAction.removeCreatedDebtReminders(
        selected[0],
        inputRemoving.content
      )
    );
    if (removeDebtReminders.status === false) {
      return setInputRemoving((prev) => ({
        ...prev,
        content: "",
        status: removeDebtReminders.msg,
      }));
    }
    setOpen(false);
    setSelected([]);
  };

  const handlePaymentDebtReminders = async () => {
    if (inputPayment.otp === "") {
      return setInputRemoving((prev) => ({
        ...prev,
        content: "",
        status: "Vui lòng nhập đầy đủ thông tin cần thiết!",
      }));
    }
    const paymentDebtReminders = await dispatch(
      debtRemindersAction.paymentCreatedDebtReminders(
        selected[0],
        inputPayment.otp,
        inputPayment.content
      )
    );
    if (paymentDebtReminders.status === false) {
      return setInputPayment((prev) => ({
        ...prev,
        content: "",
        status: paymentDebtReminders.msg,
      }));
    }
    const data = paymentDebtReminders.data.transaction;
    const string = `Quý khách đã thanh toán nhắc nợ thành công ${data.money} VND cho ${data.desAccountName} số tài khoản ${data.desAccountNumber}.
                          Số dư tài khoản ${data.delta} VND lúc ${data.datetime}. Số dư ${data.accountMoney} VND`;
    setInputPayment((prev) => ({
      ...prev,
      content: "",
      status: string,
    }));
    setOpen2(false);
    setOpen3(true);
    setSelected([]);
  };

  const renderRemoveDebtReminder = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Bạn muốn hủy nhắc nợ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Nội dung hủy nhắc nợ"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: false,
                }}
                value={inputRemoving.content}
                onChange={(event) => {
                  const content = event.target.value;
                  setInputRemoving((prev) => ({
                    ...prev,
                    content,
                  }));
                }}
              />
              <h6 style={{ color: "red" }}>{inputRemoving.status}</h6>
            </GridItem>
          </GridContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handleRemoveDebtReminders} color="primary" autoFocus>
          Xóa nhắc nợ
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPaymentDebtReminders1 = (
    <Dialog
      open={open1}
      onClose={handleClose1}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Thanh toán nhắc nợ"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Sô tài khoản nguồn"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: true,
                }}
                value={inputPayment.srcAccountNumber}
              />
              <CustomInput
                labelText="Số tài khoản đích"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: true,
                }}
                value={inputPayment.desAccountNumber}
              />
              <CustomInput
                labelText="Tên tài khoản đích"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: true,
                }}
                value={inputPayment.desAccountName}
              />
              <CustomInput
                labelText="Nội dung thanh toán nhắc nợ"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: false,
                }}
                value={inputPayment.content}
                onChange={(event) => {
                  const content = event.target.value;
                  setInputPayment((prev) => ({
                    ...prev,
                    content,
                  }));
                }}
              />
              <h6 style={{ color: "red" }}>{inputPayment.status}</h6>
            </GridItem>
          </GridContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose1} color="primary">
          Đóng
        </Button>
        <Button
          onClick={async () => {
            if (inputPayment.content === "") {
              return setInputPayment((prev) => ({
                ...prev,
                status: "Vui lòng nhập nội dung thanh toán",
              }));
            }
            const otp = await dispatch(transactionAction.getOTP());
            if (otp.status === false) {
              return setInputPayment((prev) => ({
                ...prev,
                status: otp.msg,
              }));
            }
            setInputPayment((prev) => ({
              ...prev,
              status: "",
            }));
            setOpen1(false);
            setOpen2(true);
          }}
          color="primary"
          autoFocus
        >
          Tiếp tục
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPaymentDebtReminders2 = (
    <Dialog
      open={open2}
      onClose={handleClose2}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Thanh toán nhắc nợ"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="OTP được gửi đến email"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  disabled: false,
                }}
                value={inputPayment.otp}
                onChange={(event) => {
                  const otp = event.target.value;
                  setInputPayment((prev) => ({
                    ...prev,
                    otp,
                  }));
                }}
              />
              <h6 style={{ color: "red" }}>{inputPayment.status}</h6>
            </GridItem>
          </GridContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose2} color="primary">
          Đóng
        </Button>
        <Button onClick={handlePaymentDebtReminders} color="primary" autoFocus>
          Thanh toán nhắc nợ
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPaymentDebtReminders3 = (
    <Dialog
      open={open3}
      onClose={handleClose3}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Thanh toán nhắc nợ"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h6 style={{ color: "green" }}>{inputPayment.status}</h6>
            </GridItem>
          </GridContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose3} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <GridContainer className={classes.root}>
      {/* Hủy nhắc nợ */}
      {renderRemoveDebtReminder}

      {/* Thanh toán nhắc nợ */}
      {renderPaymentDebtReminders1}
      {renderPaymentDebtReminders2}
      {renderPaymentDebtReminders3}

      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          tablename={tablename}
          numSelected={selected.length}
          dispatch={dispatch}
          selected={selected}
          setOpen={setOpen}
          setOpen1={setOpen1}
          setInputPayment={setInputPayment}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      key={row._id}
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row._id}
                      </TableCell>
                      <TableCell align="right">
                        {row.srcAccountNumber}
                      </TableCell>
                      <TableCell align="right">{row.srcAccountName}</TableCell>
                      <TableCell align="right">{row.debtMoney}</TableCell>
                      <TableCell align="right">{row.debtContent}</TableCell>
                      <TableCell align="right">{row.datetime}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </GridContainer>
  );
};

export default connect()(EnhancedTable);
