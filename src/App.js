import logo from "./logo.svg";
import "./App.css";
import useStateRef from "react-usestateref";
import axios from "axios";
import {
  AppBar,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import randomColor from "randomcolor";
import { useState, useEffect } from "react";

import background from "./pay.png";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const textfieldColor = () => ({
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

function App() {
  const fields = ["Amount", "USD", "INR"];

  const [amount, setAmount] = useState();

  const [amt, setamt] = useState();

  const [convertedamt, setconvertedamt] = useState();

  console.log(amt, convertedamt);

  const handleAmount = (e, text) => {
    if (text === "Amount") {
      setAmount(e);
    }
  };

  const handleSubmit = () => {
    axios.post("http://192.168.1.41:8080/convert", { amount }).then((res) => {
      setamt(res.data.amount);
      setconvertedamt(res.data.message);
    });
  };

  const [rates, setRates, ratesRef] = useStateRef({});

  var myData = [];

  var myLables = [];

  var bgColors = [];

  const [chartData, setChartData] = useState({
    labels: myLables,
    datasets: [
      {
        label: "Currency Converter",
        data: myData,
        backgroundColor: bgColors,
      },
    ],
  });

  const getData = async () => {
    const response = await axios.get("http://192.168.1.41:8080/chart");

    const data = await response.data.rates;

    setRates(data);

    ratesRef.current.map((obj) => {
      myLables.push(obj.date);
      myData.push(obj.inr);
      bgColors.push(
        randomColor()

      );
    });

    console.log(myLables);
    console.log(myData);
    console.log(bgColors);

    
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "green" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Currency Conversion
          </Typography>
         
        </Toolbar>
      </AppBar>

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        minHeight="94vh"
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          color="green"
          sx={{ backdropFilter: "blur(3px)", padding: "20px" }}
        >
          Convert USD to INR
        </Typography>

        <Stack
          padding="100px"
          border="1px solid gray"
          direction="column"
          sx={{ backdropFilter: "blur(5px)" }}
        >
          <Stack direction="row" justifyContent="space-evenly" gap="20px">
            {fields.map((text) => (
              <Stack gap="20px" direction="column">
                <Typography>{text}</Typography>
                <TextField
                  value={
                    text === "USD" ? "USD" : text === "INR" ? "INR" : amount
                  }
                  sx={textfieldColor}
                  onChange={(e) => handleAmount(e.target.value, text)}
                ></TextField>
              </Stack>
            ))}
          </Stack>
          <Stack
            marginTop="50px"
            direction="row"
            justifyContent="center"
            maxWidth="100%"
          >
            <Button
              sx={{
                color: "#F9F9F9",
                backgroundColor: "#557C55",
                "&:hover": { backgroundColor: "#557C55" },
                width: "100px",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>

          <Stack
            marginTop="50px"
            gap="100px"
            direction="row"
            justifyContent="center"
            maxWidth="100%"
          >
            {amt ? (
              <Typography variant="h5">
                {amt} USD = {convertedamt} INR
              </Typography>
            ) : null}
          </Stack>
        </Stack>

        <Bar style={{ backdropFilter: "blur(10px)"}}
          options={{
            scales: {
              y: {
                min: 75,
                max: 80,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Currency Converter",
                fontSize: "25px",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
          data={chartData}
        />
      </Stack>
    </>
  );
}

export default App;
