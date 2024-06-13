import React, { useState } from 'react';
import Header from '../Layout/Header';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import uploadPdf from '../upload';

const Home = () => {

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const isAuth = Boolean(useSelector((state) => state.token));
    const token = useSelector((state) => state.token);

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to choose file',
                text: "File size exceeds 5MB. Please upload a smaller file.",
            });
            document.getElementById('pdfUpload').value = null;
        } else {
            setFile(event.target.files[0]); 
        }
    };

    const handleClear = () => {
        setFile(null);
        document.getElementById('pdfUpload').value = null;
    };

    const handleUpload = async(event) => {
        event.preventDefault();
        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'No file uploaded',
                text: 'Please upload a file before submitting.',
            });
            return;
        }

        setUploading(true);

        if(!isAuth) {
            navigate("/sign-in", { state : { file } })
        }else {
            const formData = new FormData();
            formData.append("accessToken", token);
            formData.append("pdf", file);
            await uploadPdf(formData, navigate);
            setUploading(false);
            handleClear();
        }


    };

    return (
        <>
            <Header />

            <section className='section-padding'>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-xl-6 my-auto">
                            <div className='img-area'>
                                <img src="assets/images/upload.svg" alt="" />
                            </div>
                        </div>
                        <div className="col-12 col-xl-6">
                            <div className="card pt-5 pb-5 ps-4 pe-4 ps-sm-5 pe-sm-5 custom-card">
                                <h4 className='text-primary text-center'>Upload your file</h4>
                                <form action="" className='pt-5' onSubmit={handleUpload}>
                                    <label htmlFor="pdfUpload" className='upload-file-area'>
                                        <input
                                            id='pdfUpload'
                                            name='pdfUpload'
                                            type="file"
                                            accept='.pdf'
                                            onChange={handleFileChange} />
                                        {!file && (
                                            <div className='upload-area'>
                                                <i className="bi bi-upload"></i>
                                                <span>Upload your file here...</span>
                                            </div>
                                        )}
                                        {file && (
                                            <div className="uploaded-area">
                                                <img src="assets/images/pdf.png" className='pdf-icon' alt="" />
                                                <div>
                                                    <div className='filename'>{file.name}</div>
                                                    <div className='filesize'>{(file.size / 1024).toFixed(2)} KB</div>
                                                </div>
                                            </div>
                                        )}
                                    </label>

                                    <div className="d-flex justify-content-end gap-10 mt-5">
                                        <button
                                            className='btn btn-primary btn-lg file-upload-button btn-font'
                                            type="submit"
                                            disabled={uploading}>

                                            {uploading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Uploading
                                                </>
                                            ) : (
                                                <> Upload</>
                                            )}
                                        </button>
                                        {file && (
                                            <button
                                                className='btn btn-danger btn-lg file-clear-button btn-font'
                                                type="button"
                                                onClick={handleClear} >
                                                Clear
                                            </button>
                                        )}
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

export default Home;