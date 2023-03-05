import React, { useState } from "react";

interface FormProps {
  // Define the interface for the form inputs
  username: string;
  password: string;
}

const Form: React.FC<FormProps> = () => {
  // Define state for the form inputs
  const [formInputs, setFormInputs] = useState<FormProps>({
    username: "",
    password: "",
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
      const response = await fetch("http://localhost:5000/api/register", {
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
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formInputs.username}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formInputs.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
