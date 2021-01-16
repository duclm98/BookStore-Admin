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

import { accountAction } from "../../redux";

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => {
  return {
    accountsList: state.accountsList,
  };
};

const AccountsList = ({ dispatch, accountsList }) => {
  const classes = useStyles();

  const [type, setType] = useState({
    code: 0,
    name: "Tài khoản quản lý",
  });
  const [accounts, setAccounts] = useState([]);

  const getAccountsList = async () => {
    await dispatch(accountAction.getAccounts());
  };

  useEffect(() => {
    if (accountsList.change) {
      getAccountsList();
    }
  }, [accountsList.change]);

  useEffect(() => {
    if (type.code === 0) {
      setAccounts(accountsList.data.filter((i) => i.vaiTro === "quan_ly"));
    } else if (type.code === 1) {
      setAccounts(accountsList.data.filter((i) => i.vaiTro === "khach_hang"));
    }
  }, [type, accountsList.data]);

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
                        name: "Tài khoản quản lý",
                      });
                    }}
                  >
                    Tài khoản quản lý
                  </Button>
                  <Button
                    color="primary"
                    style={{ width: "200px" }}
                    onClick={() => {
                      setType({
                        code: 1,
                        name: "Tài khoản khách hàng",
                      });
                    }}
                  >
                    Tài khoản khách hàng
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{type.name}</h4>
                  <Table rows={accounts || []}></Table>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default connect(mapStateToProps)(AccountsList);
