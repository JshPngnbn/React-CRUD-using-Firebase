import React, { useEffect, useState } from "react";
import "../App.css";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { database } from "../firebase";
import Items from "./Items";

//alert message for saving successfully//
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//initial value//
const initialState = {
  priceValue: "",
  costValue: "",
  stockValue: "",
};

function Menu() {
  //tab title//
  useEffect(() => {
    document.title = "CRUD";
  }, []);

  //dialog box//
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //category data//
  const [data, setData] = useState({});

  useEffect(() => {
    database.child("crud/Menu/Category").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });

    return () => {
      setData([]);
    };
  }, []);

  //autocomplete value//
  const [categoryValue, setCategoryValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [sizeValue, setSizeValue] = useState("");

  //on change//
  const [state, setState] = useState(initialState);
  const { priceValue, costValue, stockValue } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  // Function for dependent autocomplete //
  const [refdata, setRefData] = useState([]);

  useEffect(() => {
    const appData = database.child(`crud/Menu/Name/${categoryValue}`);
    appData.on("value", (snapshot) => {
      if (!categoryValue) {
        setRefData([]);
      } else {
        setRefData({ ...snapshot.val() });
      }
    });

    return () => {
      setRefData([]);
    };
  }, [categoryValue]);

  //options e.g small, medium, large//
  const [size, setSize] = useState([]);

  useEffect(() => {
    const sizeData = database.child(`crud/Menu/options/${nameValue}`);
    sizeData.on("value", (snapshot) => {
      if (!nameValue) {
        setSize([]);
      } else if (snapshot.val() === null) {
        document.getElementById("Options").style.display = "none";
      } else {
        document.getElementById("Options").style.display = "block";
        setSize({ ...snapshot.val() });
      }
    });

    return () => {
      setSize([]);
    };
  }, [nameValue]);

  //saving to firebase realtime database//
  const itemsPath = database.child(`crud/Items`);

  function submit() {
    if (
      !categoryValue ||
      !nameValue ||
      !priceValue ||
      !costValue ||
      !stockValue
    ) {
      console.log("Please provide value in each input field");
    } else {
      itemsPath.push({
        items_category: categoryValue,
        items_name: nameValue,
        items_size: sizeValue,
        items_price: priceValue,
        items_cost: costValue,
        items_stock: stockValue,
      });
      setOpenAlert(true);
      setOpen(false);
      setState(initialState);
    }
  }

  //open and close alert message//
  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Container maxWidth="lg">
      <h1>CRUD</h1>
      <Button
        onClick={handleClickOpen}
        style={styles.newItemButton}
        size="small"
        startIcon={<AddIcon />}
        variant="contained"
      >
        New Item
      </Button>
      <Items />
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{"Add a new items"}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={styles.stack}>
              <Autocomplete
                filterSelectedOptions
                options={Object.values(data)}
                inputValue={categoryValue}
                onInputChange={(event, newInputValue) => {
                  setCategoryValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
              <Autocomplete
                options={Object.values(refdata)}
                inputValue={nameValue}
                key={Object.values(refdata)}
                onInputChange={(event, newInputValue) => {
                  setNameValue(newInputValue);
                }}
                renderInput={(params) => <TextField {...params} label="Name" />}
              />
              <div id="Options">
                <Autocomplete
                  options={Object.values(size)}
                  inputValue={sizeValue}
                  key={Object.values(size)}
                  onInputChange={(event, newInputValue) => {
                    setSizeValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Size" />
                  )}
                />
              </div>
              <div style={styles.textfieldDiv}>
                <TextField
                  style={styles.textfieldLeft}
                  label="Price"
                  variant="outlined"
                  type="number"
                  name="priceValue"
                  onChange={handleInputChange}
                  value={priceValue}
                />
                <TextField
                  style={{ width: 100 }}
                  label="Cost"
                  variant="outlined"
                  type="number"
                  name="costValue"
                  onChange={handleInputChange}
                  value={costValue}
                />
                <TextField
                  style={styles.textfieldRight}
                  label="Stock"
                  variant="outlined"
                  type="number"
                  name="stockValue"
                  onChange={handleInputChange}
                  value={stockValue}
                />
              </div>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="small"
              onClick={submit}
              style={styles.saveButton}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              style={styles.closeButton}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Saved Successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

const styles = {
  newItemButton: {
    color: "#1F2937",
    backgroundColor: "#6BDCFB",
    fontFamily: "Poppins",
  },
  stack: {
    width: 300,
    marginTop: 1,
  },
  textfieldDiv: {
    display: "flex",
  },
  textfieldLeft: {
    width: 100,
    marginRight: 10,
  },
  textfieldRight: {
    width: 100,
    marginLeft: 10,
  },
  saveButton: {
    color: "#FFFFFF",
    backgroundColor: "#1F2937",
    fontFamily: "Poppins",
  },
  closeButton: {
    color: "#1F2937",
    borderColor: "#1F2937",
    border: "1px solid",
  },
};

export default Menu;
