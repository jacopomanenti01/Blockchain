import React, { useState } from "react";
import Dropzone, {DropzoneOptions} from "react-dropzone";

interface UploadFileProps {
    onDrop: DropzoneOptions['onDrop'];
    file: File | null
  }

const UploadFile: React.FC<UploadFileProps> = ({ onDrop, file }) => {
  //const [file, setFile] = useState(null);


  return (
    <div className="main-container">
      <Dropzone onDrop={ onDrop } accept={"image/*"}  minSize={1024} maxSize={3072000}>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

          return (
            <div 
              {...getRootProps({
                className: `border-dashed border-muted p-8 block w-full border-4 border-black rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`
              })}
            >
              <input {...getInputProps()} />
              <p>Drag'n'drop images, or click to select files</p>
            </div>
          );
        }}
      </Dropzone>
      {file && (
        <>
          <h4>File Uploaded Successfully !!</h4>
          <img src={URL.createObjectURL(file)} className="img-container" alt="Uploaded file" />
        </>
      )}
    </div>
  );
};

export default UploadFile;