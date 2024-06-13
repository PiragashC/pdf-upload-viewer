import React, { useState } from 'react';
import Header from '../Layout/Header';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';
import uploadPdf from '../upload';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [emailExists, setEmailExist] = useState(false);
    const [require, setRequire] = useState(false);

    const navigate = useNavigate();
    const location = useLocation()
    const { file } = location.state || {};
   
    const initialSignUpInfo = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User'
     }
     const [signUpInfo, setSignUpInfo] = useState(initialSignUpInfo);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleInputChange = async(e) => {
        const { name, value } = e.target;
        setSignUpInfo({...signUpInfo, [name]: value });
        if(name === "email") {
            setEmailExist(false);
            try {
                const response = await axios.post("http://localhost:5000/api/auth/check-user-registerd", { email : value });
                console.log(response.data);
                setEmailExist(response.data?.emailExists);
            }catch (err) {
                console.log(err);
            }
        }
    };

    const register = async(signUpInfo) => {
        try {
            const response = await api.post("/api/auth/register", signUpInfo);
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Register Success',
                text: 'You have been registered successfully',
            });
            navigate("/sign-in");
        }catch(err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Register',
                text: err.response.data.error,
            });
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!signUpInfo.name || !signUpInfo.email || !signUpInfo.password || !signUpInfo.confirmPassword) {
            setRequire(true);
            Swal.fire({
                icon: 'error',
                title: 'Error in Submission',
                text: "Please fill all required fields!",
            });
            return;
        }
        if (signUpInfo.password !== signUpInfo.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error in Submission',
                text: "Password & Confirm Password do not match!",
            });
            return;
        }
        if (signUpInfo.password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Error in Submission',
                text: "Password must be atleast 8 characters long!",
            });
            return;
        }

        const { confirmPassword, ...updatedSignUpInfo } = signUpInfo;

        if(!file) {
            await register(updatedSignUpInfo);
        }else {
            const formData = new FormData();
            formData.append("email", signUpInfo.email);
            formData.append("name", signUpInfo.name);
            formData.append("password", signUpInfo.password);
            formData.append("role", signUpInfo.role);
            formData.append("pdf", file);
            await uploadPdf(formData, navigate);
        }
       setSignUpInfo(initialSignUpInfo);
    };

    return (
      <>
        <Header />

        <section className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-12 col-xl-6 my-auto">
                <div className="img-area">
                  <img src="assets/images/signup.svg" alt="" />
                </div>
              </div>
              <div className="col-12 col-xl-6">
                <div className="card pt-5 pb-5 ps-4 pe-4 ps-sm-5 pe-sm-5 custom-card">
                  <h4 className="text-primary text-center">
                    <b>CREATE YOUR ACCOUNT</b>
                  </h4>

                  <form action="" className="mt-5" onSubmit={handleSubmit}>
                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="userName"
                          placeholder="Username"
                          name="name"
                          value={signUpInfo.name}
                          onChange={handleInputChange}
                        />
                        <label for="userName">Username*</label>
                      </div>
                    </div>
                    {require && <small className='text-danger text-capitalized form-error-message'>{signUpInfo.name === "" && "Required!"}</small>}

                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          name="email"
                          value={signUpInfo.email}
                          onChange={handleInputChange}
                        />
                        <label for="email">Email*</label>
                      </div>
                    </div>
                    {require && <small className='text-danger text-capitalized form-error-message'>{signUpInfo.email === "" && "Required!"}</small>}
                      <small className='text-danger text-capitalized form-error-message'>{(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpInfo.email)) && signUpInfo.email) ? "Enter valid email" : ""}</small>
                    <small className='text-danger text-capitalized form-error-message'>{(emailExists) ? "Email already exists" : ""}</small>

                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <div className="form-floating">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          name="password"
                          value={signUpInfo.password}
                          onChange={handleInputChange}
                        />
                        <label for="password">Password*</label>
                        <i
                          className={`bi ${
                            passwordVisible
                              ? " bi-eye-fill"
                              : " bi-eye-slash-fill"
                          } toggle-pwd`}
                          onClick={togglePasswordVisibility}
                        ></i>
                      </div>
                    </div>
                    {require && <small className='text-danger text-capitalized form-error-message'>{signUpInfo.password === "" && "Required!"}</small>}
                    <small className='text-danger text-capitalized form-error-message'>{(signUpInfo.password.length < 8 && signUpInfo.password) ? "Password must be atleast 8 characters long" : ""}</small>

                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <div className="form-floating">
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={signUpInfo.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <label for="confirm-password">Confirm Password*</label>
                        <i
                          className={`bi ${
                            confirmPasswordVisible
                              ? " bi-eye-fill"
                              : " bi-eye-slash-fill"
                          } toggle-pwd`}
                          onClick={toggleConfirmPasswordVisibility}
                        ></i>
                      </div>
                    </div>
                    {require && <small className='text-danger text-capitalized form-error-message'>{signUpInfo.confirmPassword === "" && "Required!"}</small>}
                    <small className='text-danger text-capitalized form-error-message'>{(signUpInfo.password !== signUpInfo.confirmPassword && signUpInfo.confirmPassword) ? "Password & Confirm Password must be equal" : ""}</small>

                    <div className="input-group mb-4">
                    <label htmlFor="role">Role: </label>
                      <div className="form-check mx-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="user"
                          value="User"
                          checked={signUpInfo.role === "User"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="user">
                          User
                        </label>
                      </div>
                      {!file && <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="admin"
                          value="Admin"
                          checked={signUpInfo.role === "Admin"}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="admin">
                          Admin
                        </label>
                      </div>}
                    </div>

                    <div className="text-center mt-4 mb-4">
                      <p>
                        Already have an account?{" "}
                        <a href="/sign-in">
                          <b>Signin</b>
                        </a>
                      </p>
                    </div>

                    <div className="text-center">
                      <button className="btn btn-primary btn-lg text-uppercase btn-font">
                        {file ? "Upload" : "Register"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}

export default Signup;