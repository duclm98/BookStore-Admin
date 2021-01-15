import React, { useState } from "react";
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

import { storeAccessToken } from '../../variables/LocalStorage';
import instance from '../../services/AxiosServices';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

const Setting = ({ state, dispatch }) => {
  const classes = useStyles();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [status, setStatus]=useState('');

  const handleChangePassword = async () => {
    if (oldPassword === '' || newPassword === '' || confirmNewPassword === '') {
      return setStatus('Vui lòng điền đủ thông tin được yêu cầu.');
    }
    if (newPassword !== confirmNewPassword) {
      return setStatus('Mật khẩu không khớp.');
    }
    instance.defaults.headers.common['x_authorization'] = localStorage.getItem(storeAccessToken);
    try {
      const {data} = await instance.post('accounts/change-password', {
        oldPassword,
        newPassword
      });
      setStatus(data);
    } catch (error) {
      setStatus(error.response.data);
    }
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Thay đổi mật khẩu</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Mật khẩu cũ"
                    id="oldPassword"
                    type='password'
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={(event)=>{setOldPassword(event.target.value)}}
                  />
                  <CustomInput
                    labelText="Mật khẩu mới"
                    id="password"
                    type='password'
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={(event)=>{setNewPassword(event.target.value)}}
                  />
                  <CustomInput
                    labelText="Xác nhận mật khẩu mới"
                    id="password"
                    type='password'
                    formControlProps={{
                      fullWidth: true
                    }}
                    onChange={(event)=>{setConfirmNewPassword(event.target.value)}}
                  />
                  <h6>{status}</h6>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={handleChangePassword}>Đổi mật khẩu</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Setting;