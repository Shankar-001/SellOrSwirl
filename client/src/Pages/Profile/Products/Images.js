import { Button, Upload, message } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../Redux/lodersSlice';
import { UploadProductImage } from '../../../apicalls/products';

function Images({ selectedProduct, setShowProductForm, getData }) {
  const [showPreview, setShowPreview] = useState(true);
  const [images, setImages] = useState(selectedProduct.images);
  const [file = null, setFile] = useState(null);
  const dispatch = useDispatch();

  const upload = async () => {
    try {
      //Upload Image to Cloudinary
      console.log(file);
      dispatch(SetLoader(true));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        setShowPreview(false);
        setFile(null);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}
      >
        <div className="flex gap-5 mb-5">
          {images.map((image) => {
            return (
              <div className=" flex gap-2 border-solid border-gray-500 rounded p-2 items-end">
                <img className="h-20 w-20 object-cover" src={image} alt="" />
                <i className="ri-delete-bin-2-line" onClick={() => {}}></i>
              </div>
            );
          })}
        </div>
        <Button type="default">Upload Image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-4">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>
        <Button type="primary" disabled={!file} onClick={upload}>
          Upload
        </Button>
      </div>
    </div>
  );
}
export default Images;
