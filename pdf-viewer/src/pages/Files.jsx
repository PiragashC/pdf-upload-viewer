import React, { useEffect, useState } from 'react';
import Header from '../Layout/Header';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api';

const Files = () => {

    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [ page, setPage ] = useState(1);
    const [ apiData, setApidata ] = useState();
    const [ pdfs, setPdfs ] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading ] = useState(true);
    const [options, setOptions] = useState([]);
    
    const [selectedOption, setSelectedOption] = useState(null);
    
    const selectedOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const renderPageNumbers = () => {
        const totalPages = apiData?.totalPages;
        const currentPage = apiData?.currentPage;
        const maxPagesToShow = 5;

        if (!totalPages) return null;

        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <a className="page-link"
                        onClick={() => setPage(i)}
                        href="#">{i}</a>
                </li>
            );
        }

        return pages;
    };

    const getAllPdf = async () => {
        
        setApidata(null);
        setPdfs([]);
        setLoading(true);
        setErrorMsg('');
    
        
        let url = `/api/common-role/get-all-pdfs?page=${page}`;
        if (selectedOption && selectedOption.userId) {
            url += `&reqUserId=${selectedOption.userId}`;
        }
    
        try {
          
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
    
           
            console.log(response.data);
            setApidata(response.data);
            setPdfs(response.data?.data || []); 
        } catch (err) {
            console.log(err);
            setErrorMsg(err.response?.data?.error || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    

    const getAllUsersNames = async () => {
        try {
            const response = await api.get("/api/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            console.log(response.data);
            setOptions(response.data);
        }catch(err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        if(token && page && page>0 ) {
            getAllPdf();
        }
    }, [token, page, selectedOption]);

    useEffect(()=>{
        if(token && user.role === 'Admin') {
            getAllUsersNames();
        }
    }, [token, user]);

    return (
      <>
        <Header />

        {loading && <Skeleton count={33} />}
        {apiData ? (
          <section className="section-padding">
            <div className="container">
              <div className="page-header-area">
                <div className="row">
                  <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-4 mb-lg-0">
                    <h4 className="text-primary mb-0">
                      <b>Files</b>
                    </h4>
                  </div>
                  {user.role === "Admin" && <div className="col-12 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <FloatLabel className="w-full h-100">
                      <Dropdown
                        inputId="selectOption"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.value)}
                        options={options}
                        optionLabel="name"
                        placeholder="Select"
                        filter
                        valueTemplate={selectedOptionTemplate}
                        itemTemplate={optionTemplate}
                        className="w-full w-100 h-100"
                      />
                      <label htmlFor="selectOption">Select User</label>
                    </FloatLabel>
                  </div>}
                  {user.role === "Admin" &&<div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-4 mb-lg-0 my-2"
                  onClick={()=>window.location.reload()}>
                    <Link className="text-primary mb-0">
                      <b>Show all Users PDF</b>
                    </Link>
                    </div>}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card custom-card file-view-area p-3">
                    <div className="card-body pt-0 pb-4 pe-0 ps-0">
                      <div className="row files-show-area">
                        {pdfs.map((pdf) => {
                            const pdfUrl = pdf.pdfUrl;
                          return (
                            <div className="col-12 col-xl-4 col-md-6 col-sm-6">
                              <article className="file-item">
                                <img src="assets/images/pdf-file.png" alt="" />
                                <div className="file-detail">
                                  <h6 className="file_name">{pdf.fileName}</h6>
                                  <p className="upload_date">{pdf.uploadedDate}</p>
                                  <p className="file_size">{pdf.fileSize}</p>
                                </div>
                                <button
                                  className="file-action-button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul className="dropdown-menu file-action-menu">
                                  <li>
                                    <button
                                      className="dropdown-item text-dark mb-1"
                                      onClick={()=>navigate("/file-view", {state: {pdfUrl}})}
                                    >
                                      <i className="bi bi-eye-fill me-3"></i>
                                      View
                                    </button>
                                  </li>
                                  <li>
                                  <div className="file-detail">
                                  <h6 className="file_name">Uploaded By:</h6>
                                  <p className="upload_date">{pdf.user?.name}</p>
                                  <p className="file_size">{pdf.user?.email}</p>
                                </div>
                                  </li>
                                  {/* <li>
                                    <a
                                      className="dropdown-item text-danger"
                                      href="#"
                                      onClick={handleDelete}
                                    >
                                      <i className="bi bi-trash-fill me-3"></i>
                                      Delete
                                    </a>
                                  </li> */}
                                </ul>
                              </article>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="card-footer d-flex align-items-center justify-content-between p-3">
                      <div className="file-count">
                        <h6 className="mb-1 text-dark">Total files : {apiData?.totalCount}</h6>
                        <p className="mb-0">Page : {apiData?.currentPage} of {apiData?.totalPages}</p>
                      </div>
                      <nav aria-label="...">
                        <ul className="pagination mb-0">
                          <li className={`page-item ${(apiData?.currentPage !== 1 && apiData?.totalPages !== 1) ? "" : "disabled"} `}
                          onClick={()=>{
                            (apiData?.currentPage !== 1 && apiData?.totalPages !== 1) &&
                            setPage(page-1)
                            }}>
                            <a className="page-link">Previous</a>
                          </li>
                          {renderPageNumbers()}
                          <li className={`page-item ${(apiData?.currentPage !== apiData?.totalPages) ? "" : "disabled"}`}
                          onClick={()=>{
                            (apiData?.currentPage !== apiData?.totalPages) &&
                            setPage(page+1)
                            }}>
                            <a className="page-link" href="#">
                              Next
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <h4 className="text-primary mb-0 my-5">
            <b>{errorMsg}</b>
          </h4>
        )}
      </>
    );
}

export default Files;