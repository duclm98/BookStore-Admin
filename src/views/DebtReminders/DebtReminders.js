import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CreatingDebtRemindersTable from "views/DebtReminders/CreatingDebtRemindersTable";
import CreatedDebtRemindersTable from "views/DebtReminders/CreatedDebtRemindersTable";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { accountAction, debtRemindersAction } from "../../redux";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

const DebtReminders = ({
  dispatch,
  debtRemindersFromState,
  unpaidCreatedDebtRemindersFromState,
  paidCreatedDebtRemindersFromState,
}) => {
  const classes = useStyles();

  const [input, setInput] = useState({
    accountNumber: "",
    accountName: "",
    debtMoney: "",
    debtContent: "",
    status: "",
  });

  const [table, setTable] = useState({
    name: "Nhắc nợ đã tạo",
    type: 0,
    creatingDebtReminders: [],
    unpaidCreatedDebtReminders: [],
    paidCreatedDebtReminders: [],
  });

  // Lấy danh sách nhắc nợ đã tạo hoặc nhắc nợ được tạo
  useEffect(() => {
    if (debtRemindersFromState.changeList === true) {
      dispatch(debtRemindersAction.getCreatingDebtReminders());
    }
    if (unpaidCreatedDebtRemindersFromState.changeList === true) {
      dispatch(debtRemindersAction.getUnpaidCreatedDebtReminders());
    }
    if (paidCreatedDebtRemindersFromState.changeList === true) {
      dispatch(debtRemindersAction.getPaidCreatedDebtReminders());
    }
  }, [
    debtRemindersFromState.changeList,
    unpaidCreatedDebtRemindersFromState.changeList,
    paidCreatedDebtRemindersFromState.changeList,
  ]);

  // Gửi acction lấy accountName từ accountNumber
  useEffect(() => {
    const getAccount = async () => {
      const account = await dispatch(
        accountAction.getAccount(input.accountNumber)
      );
      if (account.status === true && account.data.accountName) {
        const accountName = account.data.accountName;
        setInput((prev) => ({
          ...prev,
          accountName,
        }));
      } else {
        setInput((prev) => ({
          ...prev,
          accountName: "",
        }));
      }
    };
    getAccount();
  }, [input.accountNumber]);

  // Tạo nhắc nợ
  const HandleCreatDebtReminders = async () => {
    if (
      input.accountNumber === "" ||
      input.accountName === "" ||
      input.debtMoney === "" ||
      input.debtContent === ""
    ) {
      return setInput((prev) => ({
        ...prev,
        status: "Vui lòng nhập đầy đủ thông tin cần thiết!",
      }));
    }
    const createDebtReminders = await dispatch(
      debtRemindersAction.createDebtReminders({
        accountNumber: input.accountNumber,
        debtContent: input.debtContent,
        debtMoney: input.debtMoney,
      })
    );
    if (!createDebtReminders.status) {
      return setInput((prev) => ({
        ...prev,
        status: createDebtReminders.msg,
      }));
    }
    return setInput({
      accountNumber: "",
      accountName: "",
      debtMoney: "",
      debtContent: "",
      status: "Tạo nhắc nợ thành công.",
    });
  };

  // Xử lý real-time cho bên được tạo nhắc nợ (khi bên tạo nhắc nợ tạo 1 nhắc nợ thì bên được nhắc lập tức thêm 1 dòng vào nhắc nợ chưa thanh toán)
  const [sseDebtRemindersAdded, setSseDebtRemindersAdded] = useState({
    data: null,
    isCalled: false,
  });

  const sse = (url, event) => {
    setSseDebtRemindersAdded((prev) => ({
      ...prev,
      data: null,
    }));
    if (typeof EventSource === "undefined") {
      console.log("not support");
      return;
    }

    const src = new EventSource(url);

    src.onerror = function (e) {
      console.log("error: " + e);
    };

    src.addEventListener(
      event,
      function (e) {
        setSseDebtRemindersAdded((prev) => ({
          ...prev,
          data: JSON.parse(e.data),
        }));
      },
      false
    );
  };

  useEffect(() => {
    if (!sseDebtRemindersAdded.isCalled) {
      const url = `${process.env.REACT_APP_BASE_BACKEND_URL}debt-reminders/debt-reminders-add-event`;
      sse(url, "DEBT_REMINDERS_ADDED");

      setSseDebtRemindersAdded((prev) => ({
        ...prev,
        isCalled: true,
      }));
    }
  }, [sseDebtRemindersAdded.isCalled]);

  useEffect(() => {
    if (sseDebtRemindersAdded.data) {
      const _IDs = table.unpaidCreatedDebtReminders.map((i) => i._id);
      if (!_IDs.includes(sseDebtRemindersAdded.data._id)) {
        setTable((prev) => ({
          ...prev,
          unpaidCreatedDebtReminders: [
            ...table.unpaidCreatedDebtReminders,
            sseDebtRemindersAdded.data,
          ],
        }));
      }
    }
  }, [sseDebtRemindersAdded.data]);


  // Xử lý real-time khi bên tạo hủy nhắc nợ (khi bên tạo nhắc nợ hủy 1 nhắc nợ thì bên được nhắc lập tức xóa 1 dòng ở nhắc nợ chưa thanh toán)
  const [sseDebtRemindersRemoved, setSseDebtRemindersRemoved] = useState({
    data: null,
    isCalled: false,
  });

  const sse1 = (url, event) => {
    setSseDebtRemindersRemoved((prev) => ({
      ...prev,
      data: null,
    }));
    if (typeof EventSource === "undefined") {
      console.log("not support");
      return;
    }

    const src = new EventSource(url);

    src.onerror = function (e) {
      console.log("error: " + e);
    };

    src.addEventListener(
      event,
      function (e) {
        setSseDebtRemindersRemoved((prev) => ({
          ...prev,
          data: JSON.parse(e.data),
        }));
      },
      false
    );
  };

  useEffect(() => {
    if (!sseDebtRemindersRemoved.isCalled) {
      const url = `${process.env.REACT_APP_BASE_BACKEND_URL}debt-reminders/debt-reminders-remove-event`;
      sse1(url, "DEBT_REMINDERS_REMOVED");

      setSseDebtRemindersRemoved((prev) => ({
        ...prev,
        isCalled: true,
      }));
    }
  }, [sseDebtRemindersRemoved.isCalled]);

  useEffect(() => {
    if (sseDebtRemindersRemoved.data) {
      const data = [];
      table.unpaidCreatedDebtReminders.map((i) => {
        if (sseDebtRemindersRemoved.data._id !== i._id) {
          data.push(i);
        }
      });
      setTable((prev) => ({
        ...prev,
        unpaidCreatedDebtReminders: data,
      }));
    }
  }, [sseDebtRemindersRemoved.data]);


  // Xử lý real-time khi bên nợ hủy nhắc nợ (khi bên nợ hủy 1 nhắc nợ thì bên tạo lập tức cập nhật lại danh sách nhắc nợ đã tạo)
  const [
    sseCreatedDebtRemindersRemoved,
    setSseCreatedDebtRemindersRemoved,
  ] = useState({ data: null, isCalled: false });

  const sse2 = (url, event) => {
    setSseCreatedDebtRemindersRemoved((prev) => ({
      ...prev,
      data: null,
    }));
    if (typeof EventSource === "undefined") {
      console.log("not support");
      return;
    }

    const src = new EventSource(url);

    src.onerror = function (e) {
      console.log("error: " + e);
    };

    src.addEventListener(
      event,
      function (e) {
        setSseCreatedDebtRemindersRemoved((prev) => ({
          ...prev,
          data: JSON.parse(e.data),
        }));
      },
      false
    );
  };

  useEffect(() => {
    if (!sseCreatedDebtRemindersRemoved.isCalled) {
      const url = `${process.env.REACT_APP_BASE_BACKEND_URL}debt-reminders/created-debt-reminders-remove-event`;
      sse2(url, "CREATED_DEBT_REMINDERS_REMOVED");

      setSseCreatedDebtRemindersRemoved((prev) => ({
        ...prev,
        isCalled: true,
      }));
    }
  }, [sseCreatedDebtRemindersRemoved.isCalled]);

  useEffect(() => {
    if (sseCreatedDebtRemindersRemoved.data) {
      let data = [];
      table.creatingDebtReminders.map((i) => {
        if (sseCreatedDebtRemindersRemoved.data._id === i._id) {
          data.push(sseCreatedDebtRemindersRemoved.data);
        } else {
          data.push(i);
        }
      });
      setTable((prev) => ({
        ...prev,
        creatingDebtReminders: data,
      }));
    }
  }, [sseCreatedDebtRemindersRemoved.data]);


  // Xử lý real-time khi bên nợ thanh toán nhắc nợ (khi bên nợ thanh toán 1 nhắc nợ thì bên tạo lập tức cập nhật lại danh sách nhắc nợ đã tạo)
  const [
    sseCreatedDebtRemindersPaymented,
    setSseCreatedDebtRemindersPaymented,
  ] = useState({ data: null, isCalled: false });

  const sse3 = (url, event) => {
    setSseCreatedDebtRemindersPaymented((prev) => ({
      ...prev,
      data: null,
    }));
    if (typeof EventSource === "undefined") {
      console.log("not support");
      return;
    }

    const src = new EventSource(url);

    src.onerror = function (e) {
      console.log("error: " + e);
    };

    src.addEventListener(
      event,
      function (e) {
        setSseCreatedDebtRemindersPaymented((prev) => ({
          ...prev,
          data: JSON.parse(e.data),
        }));
      },
      false
    );
  };

  useEffect(() => {
    if (!sseCreatedDebtRemindersPaymented.isCalled) {
      const url = `${process.env.REACT_APP_BASE_BACKEND_URL}debt-reminders/created-debt-reminders-payment-event`;
      sse3(url, "CREATED_DEBT_REMINDERS_PAYMENTED");

      setSseCreatedDebtRemindersPaymented((prev) => ({
        ...prev,
        isCalled: true,
      }));
    }
  }, [sseCreatedDebtRemindersPaymented.isCalled]);

  useEffect(() => {
    if (sseCreatedDebtRemindersPaymented.data) {
      let data = [];
      table.creatingDebtReminders.map((i) => {
        if (sseCreatedDebtRemindersPaymented.data._id === i._id) {
          data.push(sseCreatedDebtRemindersPaymented.data);
        } else {
          data.push(i);
        }
      });
      setTable((prev) => ({
        ...prev,
        creatingDebtReminders: data,
      }));
    }
  }, [sseCreatedDebtRemindersPaymented.data]);


  // Set data cho table
  useEffect(() => {
    setTable((prev) => ({
      ...prev,
      creatingDebtReminders: debtRemindersFromState.list || [],
      unpaidCreatedDebtReminders:
        unpaidCreatedDebtRemindersFromState.list || [],
      paidCreatedDebtReminders: paidCreatedDebtRemindersFromState.list || [],
    }));
  }, [
    debtRemindersFromState.list,
    unpaidCreatedDebtRemindersFromState.list,
    paidCreatedDebtRemindersFromState.list,
  ]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Quản lý nhắc nợ</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Số tài khoản"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: false,
                    }}
                    value={input.accountNumber}
                    onChange={(event) => {
                      const accountNumber = event.target.value;
                      setInput((prev) => ({
                        ...prev,
                        accountNumber,
                      }));
                    }}
                  />
                  <CustomInput
                    labelText="Tên tài khoản"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                    }}
                    value={input.accountName}
                  />
                  <CustomInput
                    labelText="Số tiền nợ"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: false,
                    }}
                    type="number"
                    value={input.debtMoney}
                    onChange={(event) => {
                      const debtMoney = event.target.value;
                      setInput((prev) => ({
                        ...prev,
                        debtMoney,
                      }));
                    }}
                  />
                  <CustomInput
                    labelText="Nội dung nhắc nợ"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: false,
                    }}
                    value={input.debtContent}
                    onChange={(event) => {
                      const debtContent = event.target.value;
                      setInput((prev) => ({
                        ...prev,
                        debtContent,
                      }));
                    }}
                  />
                  <h6 style={{ color: "red" }}>{input.status}</h6>
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={HandleCreatDebtReminders}
                  >
                    Tạo nhắc nợ
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color="primary"
                        style={{ width: "200px" }}
                        onClick={() => {
                          setTable((prev) => ({
                            ...prev,
                            name: "Nhắc nợ đã tạo",
                            type: 0,
                          }));
                        }}
                      >
                        Nhắc nợ đã tạo
                      </Button>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color="primary"
                        style={{ width: "200px" }}
                        onClick={() => {
                          setTable((prev) => ({
                            ...prev,
                            name: "Nợ chưa thanh toán",
                            type: 1,
                          }));
                        }}
                      >
                        Nợ chưa thanh toán
                      </Button>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color="primary"
                        style={{ width: "200px" }}
                        onClick={() => {
                          setTable((prev) => ({
                            ...prev,
                            name: "Nợ đã thanh toán",
                            type: 2,
                          }));
                        }}
                      >
                        Nợ đã thanh toán
                      </Button>
                    </GridItem>
                  </GridContainer>
                  {table.type === 0 ? (
                    <CreatingDebtRemindersTable
                      tablename={table.name}
                      rows={table.creatingDebtReminders}
                    ></CreatingDebtRemindersTable>
                  ) : null}
                  {table.type === 1 ? (
                    <CreatedDebtRemindersTable
                      tablename={table.name}
                      rows={table.unpaidCreatedDebtReminders}
                    ></CreatedDebtRemindersTable>
                  ) : null}
                  {table.type === 2 ? (
                    <CreatedDebtRemindersTable
                      tablename={table.name}
                      rows={table.paidCreatedDebtReminders}
                    ></CreatedDebtRemindersTable>
                  ) : null}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    debtRemindersFromState: state.debtReminders,
    unpaidCreatedDebtRemindersFromState: state.unpaidCreatedDebtReminders,
    paidCreatedDebtRemindersFromState: state.paidCreatedDebtReminders,
  };
};

export default connect(mapStateToProps)(DebtReminders);
