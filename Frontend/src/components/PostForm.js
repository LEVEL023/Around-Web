import React from 'react';
import {Form, Input, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    }
}

const PostForm = React.forwardRef(
    (props, ref) => {
        console.log('ref -> ', props, ref);
        const normFile = (e) => {
            console.log('Upload Event: ', e);
            if (Array.isArray(e)) {return e;}
            return e && e.fileList;
        }
        return (
            // We need to place ref where we want to forward to the outside. Here, the Form.
            <div>
                <Form name="validate_other"
                      {...formItemLayout}
                      ref={ref}
                >
                    <Form.Item
                        name="description"
                        label="Message"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your message'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Drag">
                        <Form.Item
                            name="uploadPost"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle>
                            <Upload.Dragger
                                name="files"
                                beforeUpload={() => {return false;}}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </div>
        );
    }
)

export default PostForm;