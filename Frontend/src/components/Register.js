import { Form, Input,  Button, message} from 'antd';
import axios from "axios";
import {BASE_URL} from "../constants";

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function Register(props) {
    const [form] = Form.useForm(); // in class-based component, obtained from HOC
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // send registration info to the server
        // 1. get username / password
        const {username, password} = values;
        const opt = {
            method: 'post',
            url: `${BASE_URL}/signup`,
            data: {
                username: username,
                password: password
            },
            headers: {'content-type': 'application/json'}
        }
        axios(opt)
            .then(
                response => {
                    console.log(response);
                    if (response.status === 200) {
                        console.log('success');
                        message.success('Registration Successful'); // we do not need then here
                        props.history.push('/login');
                    }
                }
            )
            .catch(
                err => {
                    message.error('Registration Failed');
                    console.log('Registration Failed: ', err.message);
                }
            )
    };
    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            className = "register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
            }}
            scrollToFirstError
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button className = "register-btn" type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Register;