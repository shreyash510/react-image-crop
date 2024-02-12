import React, { useEffect, useRef, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import imgUrl from './demo.jpeg'
import { canvasPreview } from './canvasPreviewFun';


const imgStyle = {
  height: "500px",
  width: "700px"
}

const initial = {
  unit: '%',
  x: 25,
  y: 25,
  width: 50,
  height: 50
}


const App = () => {
  const [crop, setCrop] = useState(initial)
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [scale, setScale] = useState(1);
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  const reactCropRef = useRef()
  let imageObject = new Image();
  let CropedImg = null;

  useEffect(() => {
    imageObject.src = `${imgUrl}`;
    imageObject.setAttribute("crossOrigin", "anonymous");
  }, [imgUrl])

  // console.log('imageObject', imageObject)

  const getResizedCropValue = (originalH, originalW, newH, newW) => {
    let HDiff = originalH / newH;
    let WDiff = originalW / newW;
    let newCrop = { ...crop, x: crop.x * WDiff, y: crop.y * WDiff, height: crop.height * HDiff, width: crop.width * WDiff }
    return newCrop;
  }

  const onImageLoad = (e) => {
    setHeight(e?.currentTarget?.height);
    setWidth(e?.currentTarget?.width);
    setCompletedCrop({
      x: 0,
      y: 0,
      height: e?.currentTarget?.height,
      width: e?.currentTarget?.width,
      unit: 'px'
    });
  };


  function getCroppedImg(imageObj, crop, fileName) {

    const canvas = document.createElement("canvas");
    const originalImage = document.createElement('canvas')
    const scaleX = imageObj.naturalWidth / imageObj.width;
    const scaleY = imageObj.naturalHeight / imageObj.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    const originalImgCtx = canvas.getContext("2d")

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "white";
    let scale = 1;
    ctx.width = crop.width;
    ctx.height = crop.height;
    originalImage.width = imageObj.width;
    originalImage.height = imageObj.height;
    originalImgCtx.drawImage(imageObj, 0, 0);
    originalImgCtx.save()
    originalImgCtx.scale(1, 1);


    // ctx.fillRect(0, 0, crop.width, crop.height);
    ctx.drawImage(
      imageObj,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    originalImgCtx.restore();
    ctx.drawImage(
      imageObj,
      imageObj.x,
      imageObj.y,
      imageObj.width,
      imageObj.height,
      0,
      0,
      crop.width,
      crop.height,
    )


    // As Base64 string
    const base64Image = canvas.toDataURL();

    return base64Image;

  }


  const download = async () => {
    let result = await canvasPreview(imgRef.current, completedCrop, scale, 0);
    console.log('result', result)
  };

  // console.log('reactCropRef', reactCropRef.current.props.crop)

  function handleImageCropOk() {
    var image = new Image();
    image.src = imgUrl;
    image.crossOrigin = "anonymous"
    image.onload = async function () {
      let _newCrop = getResizedCropValue(image.height, image.width, reactCropRef.current.props.crop.height, reactCropRef.current.props.crop.width);
      console.log('_newCrop', _newCrop)
      CropedImg = getCroppedImg(image, _newCrop, 'test');
      console.log('CropedImg', CropedImg)



    }

  }


  return (
    <>
      <ReactCrop
        src={imgUrl}
        crop={crop}
        onChange={c => setCrop(c)}
        ref={reactCropRef}
        onComplete={(e) => {
          if (e?.height == 0 || e?.width == 0) {
            setCompletedCrop({
              x: 0,
              y: 0,
              height: height,
              width: width,
              unit: 'px'
            });
          } else {
            setCompletedCrop(e);
          }
        }}
      // aspect={16 / 9}
      >
        <img 
        style={imgStyle} 
        src={imgUrl} 
        ref={imgRef}
        crossorigin='anonymous'
        alt='Error'
        />
      </ReactCrop>
      {/* <button onClick={handleImageCropOk}>Crop</button> */}
      <button onClick={download}>Crop</button>
      {
        <img
          style={imgStyle}
          src={CropedImg}
          alt="data"
          onLoad={onImageLoad}

        />
      }

    </>
  )
}

export default App