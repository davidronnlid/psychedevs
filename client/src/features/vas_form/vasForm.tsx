import React, { useState } from "react";

interface VasFormProps {
  // Define the interface for the form inputs
  date?: Date;
  value: number;
}

const VasForm: React.FC<VasFormProps> = () => {
  // Define state for the form inputs
  const [formInputs, setFormInputs] = useState<VasFormProps>({
    date: new Date(Date.now()),
    value: 0,
  });

  // Define a function to handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs({
      ...formInputs,
      [event.target.name]: event.target.value,
    });
  };

  // Define a function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("user_sesh_JWT");
      console.log("Token log", localStorage.getItem("user_sesh_JWT"));

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date:</label>
        <input type="Date" name="date" onChange={handleInputChange} required />
      </div>
      <div>
        <label htmlFor="value">Value:</label>
        <input
          type="value"
          name="value"
          value={formInputs.value}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default VasForm;
