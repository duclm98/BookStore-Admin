import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
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
import CardFooter from "components/Card/CardFooter.js";

import { authAction } from "../../redux";

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

const Login = ({ dispatch }) => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = async () => {
    if (username === "" || password === "") {
      return toast.error("Tên đăng nhập hoặc mật khẩu không được trống!");
    }

    const result = await dispatch(authAction.login(username, password));
    if (!result.status) {
      return toast.error(result.msg);
    }
  };

  return (
    <div style={{ paddingTop: 150 }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}></GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Đăng nhập</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Tên đăng nhập"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  <CustomInput
                    labelText="Mật khẩu"
                    id="password"
                    type="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                color="primary"
                onClick={() => {
                  HandleLogin();
                }}
              >
                Đăng nhập
              </Button>
              <Button color="primary">Quên mật khẩu</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default connect()(Login);
