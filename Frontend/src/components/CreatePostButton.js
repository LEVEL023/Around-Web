import React, {Component} from 'react';
import {Button, Modal, message} from "antd";
import PostForm from "./PostForm";
import {TOKEN_KEY, BASE_URL} from "../constants";
import axios from "axios";

class CreatePostButton extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            confirmLoading: false
        };
        this.postFormRef = React.createRef();
    }

    showModal = () => {
        this.setState({visible: true});
    };

    handleOk = () => {
        this.setState({visible: false});
        this.setState({confirmLoading: true});
        console.log(this.postFormRef);
        this.postFormRef.current
            .validateFields()
            .then(
                form => {
                    const {description, uploadPost} = form;
                    console.log(description, uploadPost);
                    const {type, originFileObj} = uploadPost[0];
                    const postType = type.match(/^(image|video)/g)[0];
                    if (postType) {
                        let formData = new FormData();
                        formData.append("message", description);
                        formData.append("media_file", originFileObj);
                        const opt = {
                            method: "POST",
                            url: `${BASE_URL}/upload`,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                            },
                            data: formData
                        };

                        axios(opt)
                            .then((res) => {
                                if (res.status === 200) {
                                    message.success("The image/video is uploaded!");
                                    this.postFormRef.current.resetFields();
                                    this.handleCancel();
                                    this.props.onShowPost(postType);
                                    this.setState({confirmLoading: false});
                                }
                            })
                            .catch((err) => {
                                console.log("Upload image/video failed: ", err.message);
                                message.error("Failed to upload image/video!");
                                this.setState({confirmLoading: false});
                            })
                    }
                }
                )
    };

    handleCancel = () => {
        this.setState({visible: false});
        // this.setState({confirmLoading: false});
    };

    render() {
        const {visible, confirmLoading} = this.state;
        return (
            <div>
                <Button type="primary"
                        onClick={this.showModal}
                >
                    Upload
                </Button>
                <Modal title="Create New Post"
                       confirmLoading={confirmLoading}
                       visible={visible}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                >
                    <PostForm ref={this.postFormRef}/>
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;