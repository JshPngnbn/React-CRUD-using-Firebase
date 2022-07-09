import React, { useEffect, useState } from "react";
import "../App.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { database } from "../firebase";
import { Link, useParams } from "react-router-dom";

//initial value//
const initialState = {
  items_category: "",
  items_name: "",
  items_size: "",
  items_price: "",
  items_cost: "",
  items_stock: "",
};

function Items() {
  //get id from url//
  const { id } = useParams();

  //on change//
  const [state, setState] = useState(initialState);
  const {
    items_category,
    items_name,
    items_size,
    items_price,
    items_cost,
    items_stock,
  } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  //get data from firebase using url//
  const [data, setData] = useState({});

  useEffect(() => {
    database.child("crud/Items").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });

    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }

    return () => {
      setState({ ...initialState });
    };
  }, [id, data]);

  //card//
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    database.child("crud/Items").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setCardData({ ...snapshot.val() });
      } else {
        setCardData({});
      }
    });

    return () => {
      setCardData([]);
    };
  }, []);

  //dialog data//
  const [dialogData, setDialogData] = useState({});

  //open dialog//
  const [openDialog, setOpenDialog] = useState(false);

  function handleClickOpen(id) {
    database
      .child(`crud/Items/`)
      .orderByKey()
      .equalTo(id)
      .on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          setDialogData({ ...snapshot.val() });
        } else {
          setDialogData({});
        }
      });
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //saving after editing data//

  function save(id) {
    const path = database.child(`crud/Items/${id}`);
    path.set({
      items_category: items_category,
      items_name: items_name,
      items_size: items_size,
      items_price: items_price,
      items_cost: items_cost,
      items_stock: items_stock,
    });
    setOpenDialog(false);
  }

  //on delete//
  function onDelete(id) {
    database.child("crud").child(`Items/${id}`).remove();
  }

  return (
    <>
      <div style={styles.cardDiv}>
        {Object.keys(cardData).map((id, index) => {
          return (
            <div key={index}>
              <Stack
                spacing={2}
                sx={{
                  marginTop: 1,
                  marginRight: 1,
                }}
              >
                <Card sx={{ width: 370 }} variant="outlined">
                  <CardHeader
                    action={
                      <div style={styles.cardIconButton}>
                        <Link
                          style={styles.link}
                          to={`/${id}`}
                          onClick={() => handleClickOpen(id)}
                        >
                          <CreditCardIcon
                            fontSize="small"
                            style={{ color: "#9CA3AF" }}
                          />
                        </Link>
                        <IconButton onClick={() => onDelete(id)}>
                          <DeleteIcon
                            style={{}}
                            fontSize="small"
                            color="error"
                          />{" "}
                        </IconButton>
                      </div>
                    }
                    title={cardData[id].items_name}
                    subheader={cardData[id].items_category}
                  />

                  <CardContent>
                    <br />
                    <div style={styles.cardContentDiv}>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        ₱ {cardData[id].items_price}.00 
                        &ensp; {cardData[id].items_size}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                        }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {cardData[id].items_stock} pieces available
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Stack>
            </div>
          );
        })}
      </div>
      {Object.keys(dialogData).map((id, index) => {
        return (
          <div key={index}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>{"Fill out the form"}</DialogTitle>

              <DialogContent>
                <Stack spacing={2} sx={{ marginTop: 1 }}>
                  <div>
                    <TextField
                      style={{ marginRight: 5 }}
                      label="Category"
                      value={items_category || ""}
                      name="items_category"
                      onChange={handleInputChange}
                    />
                    <TextField
                      style={{ marginLeft: 5 }}
                      label="Name"
                      value={items_name || ""}
                      name="items_name"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <TextField
                      style={{ marginRight: 5 }}
                      label="Size"
                      value={items_size || ""}
                      name="items_size"
                      onChange={handleInputChange}
                    />
                    <TextField
                      style={{ marginLeft: 5 }}
                      label="Price"
                      type="number"
                      value={items_price || ""}
                      name="items_price"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <TextField
                      style={{ marginRight: 5 }}
                      label="Cost"
                      type="number"
                      value={items_cost || ""}
                      name="items_cost"
                      onChange={handleInputChange}
                    />
                    <TextField
                      style={{ marginLeft: 5 }}
                      label="Stock"
                      type="number"
                      value={items_stock || ""}
                      name="items_stock"
                      onChange={handleInputChange}
                    />
                  </div>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => save(id)}
                  style={styles.saveButton}
                  variant="contained"
                >
                  Save
                </Button>
                <Link
                  to={`/`}
                  onClick={handleCloseDialog}
                  style={styles.closeButton}
                  variant="standard"
                >
                  <Typography>CLOSE</Typography>
                </Link>
              </DialogActions>
            </Dialog>
          </div>
        );
      })}
    </>
  );
}

const styles = {
  cardDiv: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardIconButton: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    display: "flex",
  },
  cardContentDiv: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#6BDCFB",
    color: "#1F2937",
  },
  closeButton: {
    textDecoration: "none",
    color: "#1F2937",
    marginLeft: 10,
  },
};

export default Items;
