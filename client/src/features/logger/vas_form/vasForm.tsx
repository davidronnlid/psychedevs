import React, { useState } from "react";
import { useJwt } from "../../../redux/authSlice";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationMessage from "../../../components/alerts/confirmationMessage";
import { useAppDispatch } from "../../../redux/hooks";
import { addLog } from "../../../redux/logsAPI/logsSlice";
import { nanoid } from "nanoid";

interface VasFormProps {
  date?: Date;
  value: number;
  answer_format: string;
  name: string;
  logType_id: string;
  unit: string;
}

const VasForm: React.FC<VasFormProps> = ({
  name,
  answer_format,
  value,
  logType_id,
  unit,
}) => {
  const navigate = useNavigate();

  const [logSaveSuccess, setLogSaveSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const markLabelStyle = {
    fontSize: "2.8rem",
  };

  const marksFor1To5 = [
    {
      value: 1,
      label: <span style={markLabelStyle}>😩</span>,
    },
    {
      value: 2,
      label: <span style={markLabelStyle}>😕</span>,
    },
    {
      value: 3,
      label: <span style={markLabelStyle}>🆗</span>,
    },
    {
      value: 4,
      label: <span style={markLabelStyle}>🙂</span>,
    },
    {
      value: 5,
      label: <span style={markLabelStyle}>😍</span>,
    },
  ];

  const marksFor1To10 = [
    {
      value: 1,
      label: "Terrible",
    },
    {
      value: 3,
      label: "Bad",
    },
    {
      value: 8,
      label: "Good",
    },
    {
      value: 10,
      label: "Perfect",
    },
  ];

  // Define state for the form inputs
  const [formInputs, setFormInputs] = useState<VasFormProps>({
    date: new Date(Date.now()),
    value,
    answer_format: answer_format ? answer_format : "1-5 scale",
    name: name ? name : "How do you feel right now?",
    logType_id,
    unit,
  });

  const token = useJwt();

  // Define a function to handle form input changes
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | number[] } }
  ) => {
    setFormInputs({
      ...formInputs,
      [event.target.name]: event.target.value,
    });
  };

  // Define a function to handle form submission
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || token === "") {
      // Save formInputs in localStorage if the user is not logged in
      console.log(
        "setting tempData to: JSON.stringify(formInputs) " +
          JSON.stringify(formInputs)
      );
      localStorage.setItem("tempData", JSON.stringify(formInputs));
    } else {
      try {
        const _id = nanoid();

        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        const response = await fetch(`${baseUrl}/vas/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: formInputs.date ? formInputs.date : new Date(Date.now()),
            value: formInputs.value,
            name: name,
            _id: _id.toString(),
            answer_format: answer_format,
            logType_id: logType_id,
            unit: unit,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Form submitted successfully");
        // Reset form inputs after submission
        // This will only be for the temporary redux state log so that the user gets instant updates in the UI, a separate _id will be generated serverside and it will overwrite this temporary _id

        console.log("adding this to app log state: ", {
          date: formInputs.date ? formInputs.date : new Date(Date.now()),
          value: formInputs.value,
          _id: _id.toString(),
          logType_id: logType_id,
        });

        dispatch(
          addLog({
            date: formInputs.date ? formInputs.date : new Date(Date.now()),
            value: formInputs.value,
            _id: _id.toString(),
            logType_id: logType_id,
          })
        );

        setFormInputs({
          date: new Date(Date.now()),
          value: 3,
          answer_format: answer_format,
          name: name,
          logType_id,
          unit,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    if (!token || token === "") {
      navigate("/signup");
    }

    setLogSaveSuccess(true);
    setTimeout(() => {
      setLogSaveSuccess(false);
    }, 5000);
  };

  return (
    <>
      <form onSubmit={handleSave} className="vasForm">
        <div className="formContent">
          <Typography id="value" className="hDYFRNTitle formItem" variant="h4">
            <b>{name}</b>
          </Typography>
          <Slider
            name={answer_format === "1-5 scale" ? "1-5 scale" : "1-10 scale"}
            value={formInputs.value}
            onChange={(event, newValue) => {
              handleInputChange({ target: { name: "value", value: newValue } });
            }}
            valueLabelDisplay="auto"
            step={1}
            marks={answer_format === "1-5 scale" ? marksFor1To5 : marksFor1To10}
            min={1}
            max={answer_format === "1-5 scale" ? 5 : 10}
            color="primary"
            className="formItem"
          />
          <div className="formItem">
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "green",
                color: "white",
              }}
            >
              Save log
            </Button>
          </div>
        </div>
      </form>
      <ConfirmationMessage
        message="Log saved successfully"
        state={logSaveSuccess}
        stateSetter={setLogSaveSuccess}
      />
    </>
  );
};

export default VasForm;
