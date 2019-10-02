import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UserForm = ({ errors, touched, values, status }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
      if (status) {
        setUsers([...users, status]);
      }
    }, [status]);
  
    return (
    <div className="user-form">
    <h1>User Form</h1>
    <Form>
      <Field type="text" name="name" placeholder="Name" />
      {touched.name && errors.name && (
        <p className="error">{errors.name}</p>
      )}

      <Field type="text" name="email" placeholder="Email" />
      {touched.email && errors.email && <p className="error">{errors.email}</p>}

      <Field type="text" name="password" placeholder="Password" />
      {touched.password && errors.password && (
        <p className="error">{errors.password}</p>
      )}

      <label className="checkbox-container">
        Terms of Service
        <Field
          type="checkbox"
          name="terms"
          checked={values.terms}
        />
        <span className="checkmark" />
        {touched.terms && errors.terms && (
        <p className="error">{errors.terms}</p>
      )}
      </label>

      <button type="submit">Submit!</button>
    </Form>

    {users.map(user => (
      <ul key={user.id}>
        <li>Name: {user.name}</li>
        <li>Email: {user.email}</li>
        <li>Accepted terms: {user.terms}</li>
      </ul>
    ))}
  </div>
  );
};
  
// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// There is LOTs of shared logic between multiple components, and since we only want to write that logic one time and put it in one place and then extend that logic across thos ediffenet components
//HOC helps us with them that problem 👆
// Function that takes in a component, extends some logic onto that component,
// This function is actually going to call this function twice. This is called currying functions(We won't go over all that that entails today)
// returns a _new_ component (copy of the passed in component with the extended logic)

const FormikUserForm = withFormik({
// object destructuring. We could do values.species but we are destructuring it so we can just put species. You see the same thing in Props a lot so instead of props.values you would see {values}
mapPropsToValues({ name, email, password, terms }) {
    return {
    name: name || "",
    email: email || "",
    password: password || "",
    terms: terms || false,

    };
},

validationSchema: Yup.object().shape({
    name: Yup.string().required("Your name please"),
    email: Yup.string().required("Your email please"),
    password: Yup.string().required("You must select a password"),
    terms: Yup
    .boolean()
    .oneOf([true], "Must Accept Terms and Conditions")
}),

handleSubmit(values, { setStatus, resetForm }) {
    axios
    // values is our object with all our data on it.
    .post("https://reqres.in/api/users/", values)
    .then(res => {
        setStatus(res.data);
        console.log(res);
    })
    .catch(err => console.log(err.response));
    resetForm('');
}
})(UserForm); // currying functions in Javascript
console.log("This is the HOC", FormikUserForm);

export default FormikUserForm;
