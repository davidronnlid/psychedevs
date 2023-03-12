import React, { useState } from "react";

interface VasFormProps {
  // Define the interface for the form inputs
  date?: Date;
  value: number;
  // If form is used for signup, set prop to true, if used for login, set it to false
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
      const response = await fetch("http://localhost:5000/vas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        <label htmlFor="date">date:</label>
        <input type="Date" name="date" onChange={handleInputChange} required />
      </div>
      <div>
        <label htmlFor="value">value:</label>
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
