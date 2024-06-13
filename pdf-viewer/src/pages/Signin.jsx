import React, { useState } from 'react';
import Header from '../Layout/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state';
import api from '../api';
import uploadPdf from '../upload';

const Signin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [require, setRequire] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const { file } = location.state || {};
   

    const initialSigInInfo = {
        email: '',
        password: ''
     }
     const [signInInfo, setSignInInfo] = useState(initialSigInInfo);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInputChange = async(e) => {
        const { name, value } = e.target;
        setSignInInfo({...signInInfo, [name]: value });
    };

    const login = async(loginInfo) => {
        try {
            const response = await api.post("/api/auth/login", loginInfo);
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You have been logged in successfully',
            });
            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token
                })
            )
            navigate("/");
        }catch(err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Logged In',
                text: err.response.data.error,
            });
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!signInInfo.email || !signInInfo.password) {
            setRequire(true);
            Swal.fire({
                icon: 'error',
                title: 'Error in Submission',
                text: "Please fill all required fields!",
            });
            return;
        }
        
       if( !file ) {
           await login(signInInfo);
       } else {
        const formData = new FormData();
        formData.append("registeredStatus", true);
        formData.append("email", signInInfo.email);
        formData.append("password", signInInfo.password);
        formData.append("pdf", file);
        await uploadPdf(formData, navigate);
       }
       setSignInInfo(initialSigInInfo);
    };

    return (
        <>
            <Header />

            <section className='section-padding'>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-xl-6 my-auto">
                            <div className='img-area'>
                                <img src="assets/images/signin.svg" alt="" />
                            </div>
                        </div>
                        <div className="col-12 col-xl-6">
                            <div className="card pt-5 pb-5 ps-4 pe-4 ps-sm-5 pe-sm-5 custom-card">
                                <h4 className='text-primary text-center '><b>SIGN IN</b></h4>

                                <form action="" className='mt-5' onSubmit={handleSubmit}>
                                    <div className="input-group mb-4">
                                        <span className="input-group-text">
                                            <i className='bi bi-envelope-fill'></i>
                                        </span>
                                        <div className="form-floating">
                                            <input type="email" className="form-control" id="email" placeholder="Email" 
                                            name="email"
                                            value={signInInfo.email}
                                            onChange={handleInputChange}/>
                                            <label for="email">Email*</label>
                                        </div>
                                    </div>
                                    {require && <small className='text-danger text-capitalized form-error-message'>{signInInfo.email === "" && "Required!"}</small>}
                                    <small className='text-danger text-capitalized form-error-message'>{(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInInfo.email)) && signInInfo.email) ? "Enter valid email" : ""}</small>

                                    <div className="input-group mb-4">
                                        <span className="input-group-text">
                                            <i className='bi bi-lock-fill'></i>
                                        </span>
                                        <div className="form-floating">
                                            <input type={passwordVisible ? 'text' : 'password'} className="form-control" id="password" placeholder="Password" 
                                            name="password"
                                            value={signInInfo.password}
                                            onChange={handleInputChange}/>
                                            <label for="password">Password*</label>
                                            <i className={`bi ${passwordVisible ? ' bi-eye-fill' : ' bi-eye-slash-fill'} toggle-pwd`} onClick={togglePasswordVisibility}></i>
                                        </div>
                                    </div>
                                    {require && <small className='text-danger text-capitalized form-error-message'>{signInInfo.password === "" && "Required!"}</small>}

                                    <div className='text-center mt-4 mb-4'
                                    onClick={()=>{
                                        navigate("/sign-up", { state : { file }})
                                    }}>
                                        <p>Don't have an account? <button ><b>Signup</b></button></p>
                                    </div>

                                    <div className="text-center">
                                        <button className='btn btn-primary btn-lg btn-block text-uppercase btn-font'>{file ? "Upload" : "Login"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Signin;