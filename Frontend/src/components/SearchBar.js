import React from 'react';
import {Input, Radio} from 'antd';
import {SEARCH_KEY} from "../constants";

const {Search} = Input;

function SearchBar(props) {
    const [searchType, setSearchType] = React.useState(SEARCH_KEY.all);
    const [error, setError] = React.useState("");
    const handleSearch = value => {
        // case1: show error message
        if (searchType !== SEARCH_KEY.all && value === "") {
            setError("Please input your search keyword");
            return;
        }
        // case2: clear error message
        setError("");
        props.handleSearch({
            type: searchType,
            keyword: value
        });
    }
    const changeSearchType = e => {
        const searchType = e.target.value;
        setError("");
        // case1: type === all -> value: ""
        if (searchType === SEARCH_KEY.all) {
            // fetch data to Home.js
            props.handleSearch({
                type: SEARCH_KEY.all,
                value: ""
            })
        }
        // set search type anyway
        setSearchType(searchType);
    }
    return (
        <div className="search-bar">
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                disabled={searchType === SEARCH_KEY.all}
                size="large"
                onSearch={handleSearch}
            />
            <p className='error-msg'>{error}</p>
            <Radio.Group
                className="search-type-group"
                onChange={changeSearchType}
                value={searchType}>
                <Radio value={SEARCH_KEY.all}>All</Radio>
                <Radio value={SEARCH_KEY.keyword}>Keyword</Radio>
                <Radio value={SEARCH_KEY.user}>User</Radio>
            </Radio.Group>
        </div>
    );
}

export default SearchBar;