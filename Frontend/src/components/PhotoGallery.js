import React, {useState} from 'react';
import Gallery from 'react-grid-gallery';
import PropTypes from "prop-types";
import {Button, message} from "antd";
import axios from "axios";
import {DeleteOutlined} from "@ant-design/icons";
import {BASE_URL, TOKEN_KEY} from "../constants";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

function PhotoGallery(props) {
    const [images, setImages] = React.useState(props.images);
    const [curImgIdx, setCurImgIdx] = useState(-1);
    React.useEffect(() => {
        setImages(props.images);
    },[props.images]);
    const imageArr = images.map(
        image => {
            return {
                ...image,
                customOverlay: (
                    <div style={captionStyle}>
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                )
            }
        }
    )
    const onCurrentImageChange = index => {
        console.log('Current Image Selected: ', index);
        setCurImgIdx(index);
    }
    const onDeleteImage = () => {
        // confirm delete operation
        if (window.confirm('Are you sure you want to delete this image?')) {
            const curImg = images[curImgIdx];
            console.log(curImg);
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            // remove from database
            const opt = {
                method: "delete",
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                }
            }
            axios(opt)
                .then(response => {
                    if (response.status === 200) {
                        message.success();
                        console.log("Image Deleted Successfully");
                        setImages(newImageArr);
                    }
                })
                .catch(err => {
                    message.error();
                    console.log(`Deletion Failed: ${err.message}`);
                })
        }
    }
    const wrapperStyle = {
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid #ddd",
        overflow: "auto"
    }
    return (
            <div style={wrapperStyle}>
                <Gallery images={imageArr}
                         enableImageSelection={false}
                         backdropClosesModal={true}
                         currentImageWillChange={onCurrentImageChange}
                         customControls={
                             [
                                 <Button
                                     style={{marginTop: "10px", marginLeft: "5px"}}
                                     key="deleteImage"
                                     type="primary"
                                     icon={<DeleteOutlined/>}
                                     size={"small"}
                                     onClick={onDeleteImage}
                                 >Delete Image</Button>
                             ]
                         }
                ></Gallery>
            </div>
    );
}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape(
            {
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                thumbnailWidth: PropTypes.number.isRequired,
                thumbnailHeight: PropTypes.number.isRequired,
                user: PropTypes.string.isRequired,
                caption: PropTypes.string.isRequired
            }
        )
    )
}
export default PhotoGallery;