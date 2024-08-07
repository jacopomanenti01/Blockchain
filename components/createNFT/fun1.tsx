

const FileUploader = ({ file }:any) => {
    const uploadFile = () => {
      const url = "";
      const formData = new FormData();
      formData.append("file", file);
  
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            console.log("Upload successful");
          } else {
            console.error("Upload failed", response);
          }
        })
        .catch(error => {
          console.error("Error uploading file", error);
        });
    };
  
    return (
      <button onClick={uploadFile}>Upload File</button>
    );
  };
  
  export default FileUploader;