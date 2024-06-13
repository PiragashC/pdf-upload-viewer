import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const FileViewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pdfUrl } = location.state || {};
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
      <>
        <Header />
        {pdfUrl ? (
          <section className="section-padding">
            <div className="container">
              <div className="row mb-5">
                <div className="col-12">
                  <div className="mb-5">
                    <button className="go-back-btn" onClick={handleGoBack}>
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>
                  <Worker workerUrl={pdfjsWorker}>
                    <Viewer
                      fileUrl={pdfUrl}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="mb-5 my-3 mx-3">
            <button className="go-back-btn"
            onClick={() => navigate("/files")}>
              <i className="bi bi-arrow-left me-2"></i>
              No PDF selected to view
            </button>
          </div>
        )}
      </>
    );
}
export default FileViewer;