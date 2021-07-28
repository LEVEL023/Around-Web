import React from 'react';
import axios from "axios";
import SearchBar from './SearchBar';
import {Tabs, message, Row, Col} from "antd";
import {SEARCH_KEY, BASE_URL, TOKEN_KEY} from "../constants";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";

const {TabPane} = Tabs;
let url = '';

function Home(props) {
    const [activeTab, setActiveTab] = React.useState("images");
    const [posts, setPosts] = React.useState([]);

    const [searchOption, setSearchOption] = React.useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });
    const showPost = (type) => {
        console.log("type -> ", type);
        if (type === "image") {
            setActiveTab("images");
        } else {
            setActiveTab("videos");
        }
        setTimeout(() => {
            setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
        }, 3000);
    }
    const operations = <CreatePostButton onShowPost={showPost}/>;
    React.useEffect(() => {
        // fetch new data from server
        fetchPost(searchOption);

    }, [searchOption]) // why array? [a, b] means update when a or b updates

    const fetchPost = option => {
        const {type, keyword} = option;
        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }
        // fetch data from server
        const opt = {
            method: 'GET',
            url: url,
            headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}
        }
        axios(opt)
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    const {data} = response;
                    setPosts(data);
                }
            })
            .catch(err => {
                console.log(`fetch posts failed: ${err.message}`);
                message.error("fetch post failed");
            })
    }

    const renderPosts = type => {
        // case1: no posts
        if (!posts || posts.length === 0) return (<div>no data</div>);
        // case2: images
        if (type === "images") {
            const imgArr = posts.filter(post => post.type === "image")
                .map( image => ({
                    src: image.url,
                    thumbnail: image.url,
                    thumbnailWidth: 300,
                    thumbnailHeight: 200,
                    user: image.user,
                    caption: image.message,
                    postId: image.id
                }))
            return <PhotoGallery images={imgArr}/>;
        } else {
            return (
                <Row gutter={32}>
                    {posts
                        .filter((post) => post.type === "video")
                        .map((post) => (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls={true} className="video-block" />
                                <p>
                                    {post.user}: {post.message}
                                </p>
                            </Col>
                        ))}
                </Row>
            );
        }
    }

    const handleSearch = option => {
        console.log('search option --> ', option);
        setSearchOption(option);
    }

    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch}/>
            <div className="display">
                <Tabs
                    activeKey={activeTab}
                    onChange={key => setActiveTab(key)}
                    tabBarExtraContent={operations}
                    defaultActiveKey="images">
                    <TabPane tab="Images" key="images">
                        {renderPosts("images")}
                    </TabPane>
                    <TabPane tab="Videos" key="videos">
                        {renderPosts("videos")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;