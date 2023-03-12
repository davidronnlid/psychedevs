import React, { useState } from "react";

interface FormProps {
  // Define the interface for the form inputs
  username: string;
  password: string;
  signupOrLogin?: boolean;
  // If form is used for signup, set prop to true, if used for login, set it to false
}

const Form: React.FC<FormProps> = ({ signupOrLogin }: FormProps) => {
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
      let endpoint;
      if (signupOrLogin) {
        endpoint = "register";
      } else {
        endpoint = "login";
      }

      const req_endpoint = "http://localhost:5000/auth/" + endpoint;

      console.log(req_endpoint);

      const response = await fetch(req_endpoint, {
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
      {signupOrLogin ? <h3>Sign up:</h3> : <h3>Login</h3>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
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
