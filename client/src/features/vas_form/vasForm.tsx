import React, { useState } from "react";
import { useJwt } from "../../redux/authSlice";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface VasFormProps {
  // Define the interface for the form inputs
  date?: Date;
  value: number;
}

const VasForm: React.FC<VasFormProps> = () => {
  const navigate = useNavigate();

  // Define state for the form inputs
  const [formInputs, setFormInputs] = useState<VasFormProps>({
    date: new Date(Date.now()),
    value: 3,
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
          body: JSON.stringify(formInputs),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Form submitted successfully");
        // Reset form inputs after submission
        setFormInputs({
          date: new Date(Date.now()),
          value: 0,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    navigate("/signup");
  };

  return (
    <form onSubmit={handleSave} className="vasForm">
      <div>
        <Typography id="value" gutterBottom>
          <b>How are you feeling at the present moment?</b>
        </Typography>
        <Slider
          name="current mood"
          value={formInputs.value}
          onChange={(event, newValue) => {
            handleInputChange({ target: { name: "value", value: newValue } });
          }}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
          color="primary"
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        style={{
          backgroundColor: "green", // Change the background color
          color: "white", // Change the text color
        }}
      >
        Save log
      </Button>
    </form>
  );
};

export default VasForm;
