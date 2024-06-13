import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';

const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary pt-3 pb-3">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between align-items-center" id="navbarNavDropdown">
                        <ul className="navbar-nav align-items-center">
                            {user?.role !== "Admin" && <li className="nav-item">
                                <a className={`nav-link ${window.location.pathname === '/' ? 'active' : ''}`} href="/"><b>Upload</b></a>
                            </li>}
                             <li className="nav-item">
                                <a className={`nav-link ${window.location.pathname === '/files' ? 'active' : ''}`} href="/files"><b>Files</b></a>
                            </li>
                        </ul>

                        <ul className="navbar-nav align-items-center profile-nav-area">
                            {/* <li className="nav-item">
                                <a className="btn btn-outline-primary me-3" aria-current="page" href="/sign-up">Signup</a>
                            </li> */}
                            {!user && <li className="nav-item">
                                <a className="btn btn-primary" aria-current="page" href="/sign-in">Signin</a>
                            </li>}
                            {user && <li className='nav-item position-relative'>
                                <button className='profile-button ms-3'
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className='bi bi-person-fill'></i>
                                </button>
                                <ul className="dropdown-menu file-action-menu profile-action-menu">
                                <li>
                                        <a className="dropdown-item" href="#">
                                            <i className='bi bi-person-fill me-3'></i>
                                            {user?.name} - {user.role}
                                        </a>
                                    </li>
                                    <li
                                    onClick={()=> dispatch(
                                        setLogout()
                                    )}>
                                        <a className="dropdown-item text-danger" href="#">
                                            <i className='bi bi-trash-fill me-3'></i>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;