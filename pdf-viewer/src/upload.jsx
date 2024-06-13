import api from "./api";
import Swal from 'sweetalert2';


 const uploadPdf = async(uploadData, navigate) => {
    try {
        const response = await api.post("/api/user/upload-pdf", uploadData);
        console.log(response.data);
        Swal.fire({
            icon: 'success',
            title: 'File Uploaded',
            text: 'Your file has been uploaded successfully.',
        });
        navigate("/files");
    }catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Failed to upload file',
            text: err.response.data.error,
        });
    }
};

export default uploadPdf;