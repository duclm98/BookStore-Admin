import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import * as localStorageVariable from "../../variables/LocalStorage";

import { authAction, notificationAction } from "../../redux";

const useStyles = makeStyles(styles);

const AdminNavbarLinks = ({
  dispatch,
  isCalledSSENewNotification,
  notificationFromState,
}) => {
  const classes = useStyles();

  const account = JSON.parse(
    localStorage.getItem(localStorageVariable.storeAccount)
  );

  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleLogout = () => {
    setOpenProfile(null);
    dispatch(authAction.logout());
  };

  const [notification, setNotification] = useState(notificationFromState);

  // Xử lý real-time khi có thông báo mới
  const [sseNotification, setSseNotification] = useState(null);

  const sse = (url, event) => {
    setSseNotification(null);
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
        setSseNotification(JSON.parse(e.data));
      },
      false
    );
  };

  useEffect(() => {
    if (!isCalledSSENewNotification) {
      const url = `${process.env.REACT_APP_BASE_BACKEND_URL}notifications/new-notification-event`;
      sse(url, "NEW_NOTIFICATION");

      dispatch(notificationAction.calledSSENewNotification());
      dispatch(notificationAction.getNotification());
    }
  }, [isCalledSSENewNotification]);

  useEffect(() => {
    if (sseNotification && sseNotification.status) {
      dispatch(notificationAction.getNotification());
    }
  }, [sseNotification]);

  useEffect(() => {
    setNotification({
      amountNewNotifications: notificationFromState.amountNewNotifications,
      data: notificationFromState.data,
    });
  }, [notificationFromState]);

  const handleReadNotification = async (_id) => {
    dispatch(notificationAction.readNotification(_id));
    setOpenNotification(null);
  };

  const renderNotification = () => {
    return notification.data.map((i) => {
      let backgroundColor = "#F8F8FF";
      if (i.isRead === false) {
        backgroundColor = "#9FB6CD";
      }
      const style = { backgroundColor: backgroundColor };
      return (
        <MenuItem
          style={style}
          onClick={() => {
            handleReadNotification(i._id);
          }}
          className={classes.dropdownItem}
        >
          {i.content}
          <p>{i.datetime}</p>
        </MenuItem>
      );
    });
  };

  return (
    <div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          {notification.amountNewNotifications !== 0 ? (
            <span className={classes.notifications}>
              {notification.amountNewNotifications}
            </span>
          ) : null}
          <Hidden mdUp implementation="css">
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Notification
            </p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">{renderNotification()}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      {account.tenDangNhap}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      {account.email}
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      Đăng xuất
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isCalledSSENewNotification: state.isCalledSSENewNotification,
    notificationFromState: state.notification,
  };
};

export default connect(mapStateToProps)(AdminNavbarLinks);
