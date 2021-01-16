import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from "./Table";

import { categoryAction } from "../../redux";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { PersonalVideo } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => {
  return {
    categoriesList: state.categoriesList,
    editCategory: state.editCategory,
  };
};

const ReceiversList = ({ dispatch, categoriesList, editCategory }) => {
  const classes = useStyles();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState({
    id: "",
    ten: "",
  });

  const getCategoriesList = async () => {
    await dispatch(categoryAction.getCategories());
  };

  useEffect(() => {
    if (categoriesList.change) {
      getCategoriesList();
    }
  }, [categoriesList.change]);

  useEffect(() => {
    setCategories(categoriesList.data);
  }, [categoriesList.data]);

  const HandleAddCategory = async () => {
    if (name === "") {
      return toast.error("Tên danh mục sách không được trống!");
    }
    const result = await dispatch(categoryAction.addCategory(name));
    if (!result.status) {
      return toast.error(result.msg);
    }
  };

  useEffect(() => {
    let ten = "";
    categoriesList.data.map((i) => {
      if (i.id === editCategory) {
        ten = i.ten;
      }
    });
    setEdit({
      id: editCategory,
      ten,
    });
  }, [editCategory]);

  const HandleEditCategory = async () => {
    if (edit.id === "" || edit.ten === "") {
      return toast.error("Mã danh mục hoặc tên danh mục không được trống!");
    }
    const result = await dispatch(
      categoryAction.editCategory(edit.id, edit.ten)
    );
    if (!result.status) {
      return toast.error(result.msg);
    }
    await dispatch(categoryAction.handleEditCategory(""));
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Quản lý danh mục sách</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <br />
                  <CustomInput
                    labelText="Tên danh mục sách"
                    id="ten"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: false,
                    }}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                  <Button
                    color="primary"
                    onClick={() => {
                      HandleAddCategory();
                    }}
                  >
                    Thêm danh mục sách
                  </Button>
                  {editCategory !== "" ? (
                    <div>
                      <br />
                      <br />
                      <CustomInput
                        labelText="Mã danh mục sách"
                        id="id"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                        value={edit.id}
                      />
                      <CustomInput
                        labelText="Tên danh mục sách"
                        id="ten"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: false,
                        }}
                        value={edit.ten}
                        onChange={(event) => {
                          const ten = event.target.value;
                          setEdit((prev) => ({
                            ...prev,
                            ten,
                          }));
                        }}
                      />
                      <Button
                        color="primary"
                        onClick={() => {
                          HandleEditCategory();
                        }}
                      >
                        Sửa danh mục sách
                      </Button>
                    </div>
                  ) : null}
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <Table rows={categories || []}></Table>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default connect(mapStateToProps)(ReceiversList);
