import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { CircularProgress, Menu, MenuItem, Fade } from "@material-ui/core";

import Table from "./Table";

import * as localStorageVariable from "../../variables/LocalStorage";
import instance from "../../services/AxiosServices";

import { accountAction, transactionAction } from "../../redux";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

const Transaction = ({
  dispatch,
  receiversFromState,
  changeReceiversFromState,
}) => {
  const classes = useStyles();

  // Thông tin loại giao dịch (cùng hoặc khác ngân hàng)
  const [textTransactionType, setTextTransactionType] = useState(
    "Chuyển khoản cùng ngân hàng"
  );
  const [transactionType, setTransactionType] = useState(0);
  const [
    disableButtonTransactionType,
    setDisableButtonTransactionType,
  ] = useState(false);

  // Thông tin ai là người trả phí giao dịch
  const [textFormOfFeePayment, setTextFormOfFeePayment] = useState(
    "Người chuyển trả phí chuyển khoản"
  );
  const [formOfFeePayment, setFormOfFeePayment] = useState(0);

  // Thông tin tài khoản nguồn
  const account = JSON.parse(
    localStorage.getItem(localStorageVariable.storeAccount)
  );
  const srcAccountNumber = account.accountNumber;
  const srcAccountName = account.accountName;

  // Thông tin tài khoản đích
  const [desAccountNumber, setDesAccountNumber] = useState("");
  const [desAccountName, setDesAccountName] = useState("");

  // Thông tin danh bạ thụ hưởng
  const [receivers, setReceivers] = useState([]);

  // Thông tin chọn 1 tài khoản đích từ danh bạ thụ hưởng
  const [select, setSelect] = useState();

  // Thông tin chuyển khoản (số tiền, nội dung)
  const [money, setMoney] = useState();
  const [content, setContent] = useState("");
  const [otp, setOtp] = useState("");

  // Thông tin progress hiện tại, loại button hiện tại
  const [progress, setProgress] = useState(0);
  const [textButton, setTextButton] = useState("Tiếp tục");
  const [status, setStatus] = useState("");

  // Thông tin thêm danh bạ thụ hưởng
  const [accountNameReminiscent, setAccountNameReminiscent] = useState("");
  const [submit, setSubmit] = useState(false);

  // Thông tin giao dịch thành công
  const [done, setDone] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const clearState = () => {
    setProgress(0);
    setTextButton("Tiếp tục");
    setStatus("");

    setTextTransactionType("Chuyển khoản cùng ngân hàng");
    setTransactionType(0);
    setDisableButtonTransactionType(false);

    setTextFormOfFeePayment("Người chuyển trả phí chuyển khoản");
    setFormOfFeePayment(0);

    setDesAccountNumber("");
    setDesAccountName("");
    setSelect(null);

    setMoney();
    setContent("");
    setOtp("");

    setAccountNameReminiscent("");
    setSubmit(false);
    setDone("");
  };

  // Gọi action lấy account khi account number thay đổi
  useEffect(() => {
    const setDesAccountNameFunction = async ()=>{
      if (transactionType === 0) {
        const internalAccount = await dispatch(accountAction.getAccount(desAccountNumber));
        if(internalAccount.status){
          setDesAccountName(internalAccount.data.accountName);
        }
      } else if (transactionType === 1) {
        const interbankAccount = await dispatch(transactionAction.getInterbankAccount(desAccountNumber));
        if(interbankAccount.status){
          setDesAccountName(interbankAccount.data.accountName);
        }
      }
    }
    setDesAccountNameFunction();
  }, [desAccountNumber]);

  // Lấy danh bạ thụ hưởng từ state
  if (changeReceiversFromState === true) {
    dispatch(accountAction.getReceivers());
  }

  useEffect(() => {
    let arr = [];
    if (transactionType === 0) {
      arr = receiversFromState.filter((i) => !i.isAnotherBank);
    } else if (transactionType === 1) {
      arr = receiversFromState.filter((i) => i.isAnotherBank === true);
    }
    setReceivers(arr);
  }, [transactionType, receiversFromState]);

  // Chọn 1 tài khoản đích trong danh bạ thụ hưởng
  useEffect(() => {
    if (select) {
      const selected = select[0];
      for (let i = 0; i < receiversFromState.length; i++) {
        if (receiversFromState[i]._id === selected) {
          setDesAccountNumber(receiversFromState[i].accountNumber);
          setDesAccountName(receiversFromState[i].accountName);
          break;
        }
      }
    }
  }, [select]);

  const HandleMainButtonClick = async () => {
    if (progress === 1 && (desAccountNumber === "" || desAccountName === "")) {
      return setStatus("Vui lòng nhập số tài khoản cần chuyển đến");
    } else if (progress === 2 && (!money || content === "")) {
      return setStatus("Vui lòng nhập đầy đủ thông tin cần thiết");
    } else if (progress === 3 && otp === "") {
      return setStatus("Vui lòng nhập đầy đủ thông tin cần thiết");
    }

    if (progress === 2) {
      // Xử lý gửi otp
      instance.defaults.headers.common[
        "x_authorization"
      ] = localStorage.getItem(localStorageVariable.storeAccessToken);
      try {
        await instance.post("transactions/send-otp");
        setStatus("");
        setProgress(progress + 1);
      } catch (error) {
        return setStatus(error.response.data);
      }
    } else if (progress === 3) {
      instance.defaults.headers.common[
        "x_authorization"
      ] = localStorage.getItem(localStorageVariable.storeAccessToken);

      // Xử lý xác nhận giao dịch
      if (transactionType === 0) {
        try {
          const { data } = await instance.post("transactions/internal-bank", {
            formOfFeePayment,
            otp,
            desAccountNumber,
            content,
            money: +money,
          });

          const string = `Quý khách đã chuyển thành công ${data.money} VND cho ${data.desAccountName} số tài khoản ${data.desAccountNumber}.
                          Số dư tài khoản ${data.delta} VND lúc ${data.datetime}. Số dư ${data.accountMoney} VND`;
          setDone(string);

          setProgress(progress + 1);
          setStatus("");
        } catch (error) {
          return setStatus(error.response.data);
        }
      } else if (transactionType === 1) {
        try {
          const { data } = await instance.post("transactions/interbank", {
            formOfFeePayment,
            otp,
            desAccountNumber,
            desAccountName,
            content,
            money: +money,
          });

          const string = `Quý khách đã chuyển thành công ${data.money} VND cho ${data.desAccountName} số tài khoản ${data.desAccountNumber}.
                          Số dư tài khoản ${data.delta} VND lúc ${data.datetime}. Số dư ${data.accountMoney} VND`;
          setDone(string);

          setProgress(progress + 1);
          setStatus("");
        } catch (error) {
          return setStatus(error.response.data);
        }
      }
    } else {
      setStatus("");
      setProgress(progress + 1);
    }
  };

  useEffect(() => {
    if (progress === 0) {
      setTextButton("Tiếp tục");
      setDisableButtonTransactionType(false);
    } else if (progress === 1) {
      setTextButton("Tiếp tục");
      setDisableButtonTransactionType(true);
    } else if (progress === 2) {
      setTextButton("Tiếp tục");
      setDisableButtonTransactionType(true);
    } else if (progress === 3) {
      setTextButton("Chuyển ngay");
      setDisableButtonTransactionType(true);
    }
  }, [progress]);

  // Xử lý thêm danh bạ thụ hưởng
  const handleAddReceiver = () => {
    if (accountNameReminiscent === "") {
      setAccountNameReminiscent(desAccountName);
    }
    setSubmit(true);
  };
  useEffect(() => {
    if (submit) {
      const receiver = {
        accountNumber: desAccountNumber,
        accountName: desAccountName,
        accountNameReminiscent,
      };
      if (transactionType === 1) {
        receiver.isAnotherBank = true;
      }
      dispatch(accountAction.addReceiver(receiver));
      clearState();
    }
  }, [submit]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Chuyển khoản</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <br />
                  <Button
                    color="primary"
                    style={{
                      width: "250px",
                    }}
                    disabled={disableButtonTransactionType}
                    onClick={() => {
                      setTextTransactionType("Chuyển khoản cùng ngân hàng");
                      setTransactionType(0);
                    }}
                  >
                    Chuyển khoản cùng ngân hàng
                  </Button>
                  <Button
                    color="primary"
                    style={{
                      width: "250px",
                    }}
                    disabled={disableButtonTransactionType}
                    onClick={() => {
                      setTextTransactionType("Chuyển khoản liên ngân hàng");
                      setTransactionType(1);
                    }}
                  >
                    Chuyển khoản liên ngân hàng
                  </Button>
                  <CircularProgress
                    size={200}
                    style={{
                      paddingTop: 50,
                    }}
                    variant="static"
                    color="secondary"
                    value={(progress * 100) / 4}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{textTransactionType}</h4>

                  {progress === 0 ? (
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Số tài khoản nguồn"
                          id="srcAccountNumber"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            disabled: true,
                          }}
                          value={srcAccountNumber}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                          labelText="Tên tài khoản nguồn"
                          id="srcAccountName"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={srcAccountName}
                          inputProps={{
                            disabled: true,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  {progress === 1 ? (
                    <div>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                          <CustomInput
                            labelText="Số tài khoản đích"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            onChange={(event) => {
                              setDesAccountNumber(event.target.value);
                            }}
                            inputProps={{
                              disabled: false,
                            }}
                            value={desAccountNumber}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                            // labelText="Tên tài khoản đích"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                            }}
                            value={desAccountName}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <Table
                            rows={receivers}
                            setSelect={setSelect}
                          ></Table>
                        </GridItem>
                      </GridContainer>
                    </div>
                  ) : null}

                  {progress === 2 ? (
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Số tiền"
                          id="money"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          type="number"
                          value={money}
                          onChange={(event) => {
                            setMoney(event.target.value);
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                          labelText="Nội dung"
                          id="content"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={content}
                          onChange={(event) => {
                            setContent(event.target.value);
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  {progress === 2 ? (
                    <GridContainer
                      style={{
                        paddingTop: 20,
                      }}
                    >
                      <GridItem xs={12} sm={12} md={4}>
                        <Button
                          aria-controls="fade-menu"
                          aria-haspopup="true"
                          onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                          }}
                        >
                          {textFormOfFeePayment}
                        </Button>
                        <Menu
                          id="fade-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={open}
                          onClose={() => {
                            setAnchorEl(null);
                          }}
                          TransitionComponent={Fade}
                        >
                          <MenuItem
                            onClick={() => {
                              setTextFormOfFeePayment(
                                "Người chuyển trả phí chuyển khoản"
                              );
                              setFormOfFeePayment(0);
                              setAnchorEl(null);
                            }}
                          >
                            Người chuyển trả
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setTextFormOfFeePayment(
                                "Người nhận trả phí chuyển khoản"
                              );
                              setFormOfFeePayment(1);
                              setAnchorEl(null);
                            }}
                          >
                            Người nhận trả
                          </MenuItem>
                        </Menu>
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  {progress === 3 ? (
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="OTP"
                          id="otp"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          onChange={(event) => {
                            setOtp(event.target.value);
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  {progress === 3 ? (
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <h6
                          style={{
                            color: "green",
                          }}
                        >
                          Vui lòng kiểm tra email để lấy mã xác thực
                        </h6>
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  {progress === 4 ? (
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <h4 style={{ color: "green" }}>{done}</h4>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}></GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Tên gợi nhớ"
                          id="accountNameReminiscent"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            disabled: false,
                          }}
                          onChange={(event) => {
                            setAccountNameReminiscent(event.target.value);
                          }}
                        />
                        <Button color="primary" onClick={handleAddReceiver}>
                          Lưu danh bạ thụ hưởng
                        </Button>
                        <Button color="primary" onClick={clearState}>
                          Thực hiện giao dịch khác
                        </Button>
                      </GridItem>
                    </GridContainer>
                  ) : null}

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <h6
                        style={{
                          color: "red",
                        }}
                      >
                        {status}
                      </h6>
                      {progress !== 4 ? (
                        <div>
                          {progress !== 0 ? (
                            <Button
                              color="primary"
                              onClick={() => {
                                if (progress > 0) {
                                  setProgress(progress - 1);
                                  setStatus("");
                                }
                              }}
                            >
                              Trở lại
                            </Button>
                          ) : null}
                          <Button
                            color="primary"
                            onClick={HandleMainButtonClick}
                          >
                            {textButton}
                          </Button>
                        </div>
                      ) : null}
                    </GridItem>
                  </GridContainer>
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
    receiversFromState: state.receivers,
    changeReceiversFromState: state.changeReceivers,
  };
};

export default connect(mapStateToProps)(Transaction);
