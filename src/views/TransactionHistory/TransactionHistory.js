import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from "./Table.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { transactionAction } from "../../redux";

const useStyles = makeStyles(styles);

const TransactionHistory = ({ dispatch, transactionHistoryFromState }) => {
  const classes = useStyles();

  const [type, setType] = useState({
    code: 0,
    name: "Giao dịch nhận tiền",
  });
  const [historyTransaction, setHistoryTransaction] = useState([]);

  useEffect(() => {
    if (type.code === 0) {
      dispatch(transactionAction.getMoneyReceivingTransaction());
    } else if (type.code === 1) {
      dispatch(transactionAction.getMoneySendingTransaction());
    } else if (type.code === 2) {
      dispatch(transactionAction.getDebtRemindersTransaction());
    }
  }, [type]);

  useEffect(() => {
    if (type.code === 0) {
      setHistoryTransaction(
        transactionHistoryFromState.moneyReceivingTransactions
      );
    } else if (type.code === 1) {
      setHistoryTransaction(
        transactionHistoryFromState.moneySendingTransactions
      );
    } else if (type.code === 2) {
      setHistoryTransaction(
        transactionHistoryFromState.debtRemindersTransactions
      );
    }
  }, [transactionHistoryFromState]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Lịch sử giao dịch</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <br />
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 0,
                        name: "Giao dịch nhận tiền",
                      });
                    }}
                  >
                    Giao dịch nhận tiền
                  </Button>
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 1,
                        name: "Giao dịch chuyển khoản",
                      });
                    }}
                  >
                    Giao dịch chuyển khoản
                  </Button>
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 2,
                        name: "Giao dịch thanh toán nhắc nợ",
                      });
                    }}
                  >
                    Giao dịch thanh toán nhắc nợ
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Table
                    rows={historyTransaction || []}
                    tableName={type.name}
                  />
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
    transactionHistoryFromState: state.transactionHistory,
  };
};

export default connect(mapStateToProps)(TransactionHistory);
