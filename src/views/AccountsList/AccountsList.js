import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { authAction } from "../../redux";

const useStyles = makeStyles(styles);

const AccountsList = ({ dispatch, payment_savingAccountsFromState }) => {
  const classes = useStyles();

  const [type, setType] = useState({
    code: 0,
    name: "Tài khoản thanh toán",
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (type.code === 0) {
      dispatch(authAction.getPaymentAccounts());
    } else if (type.code === 1) {
      dispatch(authAction.getSavingAccounts());
    }
  }, [type]);

  useEffect(() => {
    setAccounts(payment_savingAccountsFromState);
  }, [payment_savingAccountsFromState]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Danh sách tài khoản</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <br />
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 0,
                        name: "Tài khoản thanh toán",
                      });
                    }}
                  >
                    Tài khoản thanh toán
                  </Button>
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 1,
                        name: "Tài khoản tiết kiệm",
                      });
                    }}
                  >
                    Tài khoản tiết kiệm
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{type.name}</h4>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["ID", "Số tài khoản", "Số dư"]}
                    tableData={accounts}
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
    payment_savingAccountsFromState: state.payment_savingAccounts,
  };
};

export default connect(mapStateToProps)(AccountsList);
