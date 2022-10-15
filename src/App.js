import $ from "jquery";
import React, { useState, useEffect } from "react";

import SearchTable from "./components/SearchTable";
import Pagination from "./components/Pagination";

import FileTransferLogo from "./images/filetransfer.png";
import RefreshIcon from "./images/refresh.png";
import DefaultFile from "./images/file.png";

function App()
{
    const [data, setData] = useState([]);
    
    const [entries, setEntries] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const indexOfLastPost = currentPage * entriesPerPage;
    const indexOfFirstPost = indexOfLastPost - entriesPerPage;

    const paginateData = data.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(data.length / entriesPerPage);
    const ServerIP = window.location.host.split(":")[0];

    const paginate = (direction) => {
        if (direction === "left") {
            if (currentPage !== 1 && currentPage <= totalPages) {
                setCurrentPage(currentPage - 1);
            }
        } else {
            if (currentPage !== totalPages && currentPage <= totalPages) {
                setCurrentPage(currentPage + 1);
            }
        
        } $("#selectall").prop("checked", false);
    }

    function formatFileSize(bytes, decimals=2) {
        if (bytes <= 0) return "0 Bytes";

        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const size = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, size)).toFixed(decimals < 0 ? 0 : decimals)) + " " + sizes[size];
    }

    function ReadSelectedFiles() {
        const files = [];
        $(":checkbox").each(function() {
            if (this.checked) {
                if (this.value !== "on") { files.push(this.value); }
            }
        })
        return files;
    }

    const DragHover = () => {
        const dropzone = document.querySelector(".dropzone");
    
        ["dragenter", "dragover", "dragleave", "drop"].forEach(evtName => {
            dropzone.addEventListener(evtName, (e) => e.preventDefault());
        });
    
        ["dragenter", "dragover"].forEach(evtName => {
            dropzone.addEventListener(evtName, () => dropzone.classList.add("zoneborder"));
        });
    
        ["dragleave", "drop"].forEach(evtName => {
            dropzone.addEventListener(evtName, () => dropzone.classList.remove("zoneborder"));
        });

        dropzone.addEventListener("drop", handleUpload);
    }

    const handleUpload = (event) => {
        let httpRequest = new XMLHttpRequest();
        let formData = new FormData();
        let files = null;

        if (event.type === "drop") {
            files = event.dataTransfer.files;
        } else {
            files = event.target.files;
        }

        for (let file = 0; file < files.length; file++) {
            if (/[!@#$%^&*+={};:"\\|<>?]+/.test(files[file].name)) {
                alert(`Invalid Characters in file: ${files[file].name}`);
                return;
            }
            formData.append("data", files[file]);
        
        } $("#progressBar").show();

        httpRequest.open("post", `http://${ServerIP}/api/upload`)
        httpRequest.upload.addEventListener("progress", function(event) {
            let percent = Math.round((event.loaded / event.total) * 100) + "%";
            $("#loader").text("Uploading Files... " + percent);
            $("#progressBar").width(percent);
        
        }); httpRequest.send(formData);
    }

    function fetchFiles() {
        $("#loadingBar").show();

        fetch(`http://${ServerIP}/api/getfiles`)
        .then((result) => {
            if (result.ok) return result.json();
        })
        .then((result) => {
            setEntries(result.length);
            setData(result);

            $("#loadingBar").hide();
            $("#progressBar").width(0);
            $("#loader").html(null);
            $("#upload").val(null);
        })
        .catch(() => {
            $("#timer").html(null);
            $("#loadingBar").hide();
            $("#authModal").show();

            setData([]);
            setEntries(0);
            clearInterval(window.timer);
        })
    }
    useEffect(() => {
        $("#authModal").show();
    }, []);

    function downloadFiles() {
        let files = ReadSelectedFiles();
        if (files.length === 0) {
            return;
        
        } $("#loadingBar").show();

        fetch(`http://${ServerIP}/api/download`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(files),
        })
        .then((result) => { return result.blob(); })
        .then((data) => {
            let obj = document.createElement("a");
            obj.href = window.URL.createObjectURL(data);

            if (files.length === 1) {
                obj.download = `${files}`;
            } else {
                obj.download = "files.zip";
            }
            obj.click();
            $("#loadingBar").hide();
            $(":checkbox").each(function() {
                this.checked = false;
            });
        })
    }

    function deleteFiles() {
        let files = ReadSelectedFiles();
        if (files.length === 0 || !window.confirm("Are you sure you want to Delete the Seleted Files?")) {
            return;
        }

        fetch(`http://${ServerIP}/api/delete`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(files),
        })
        .then(() => {
            fetchFiles();
            $(":checkbox").each(function() {
                this.checked = false;
            });
        })
        .catch((error) => {
            alert(error + " : Possibly Too Many Items Selected");
        
        }); $("#loadingBar").hide();
    }

    function RefreshTimer() {
        let timer = 30;
        window.timer = setInterval(function() {
            $("#timer").text(timer);
    
            if (timer <= 0) {
                timer = 30;
                fetchFiles();

            } timer--;
    
        }, 1000);
    }
    
    return (
        <div className="container">
            <div className="upload">
                <div className="dropzone" onDragOver={DragHover}>
                    <form style={{marginBottom: "10px"}}>
                        <p>Upload multiple files with the file dialog or by dragging and dropping them within the dashed region</p>
                        <input type="file" id="upload" multiple accept="image/*" onChange={handleUpload}/>
                    </form>

                    <div className="progress" style={{border: "1px solid black"}}>
                        <div id="progressBar" className="progress-bar" role="progressbar"/>
                    </div>
                    <label id="loader"/>
                    <div id="fileList"/>
                </div>
            </div>

            <div className="retrieve">
                <div id="arrows">
                    <Pagination paginate={paginate}/>
                    <label id="count">{currentPage} - {totalPages} of {data.length}</label>
                </div>

                <select id="limit" defaultValue={"10"} onChange={() => {
                        $("#selectall").prop("checked", false);
                        setEntriesPerPage($("#limit").val())
                        setCurrentPage(1);
                    }}>
                    <option value={data.length}>All:{entries == null ? "0" : entries}</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <input
                    id="search"
                    placeholder="Search"
                    onKeyUp={() => {
                        if ($("#search").val().length !== 0) {
                            $("#limit").attr("disabled", true);
                        
                        } else {
                            $("#limit").attr("disabled", false);
                        }

                        $("#limit").val(data.length);
                        setEntriesPerPage($("#limit").val());
                        setEntries(SearchTable($("#search").val()));
                        setCurrentPage(1);
                    }}>
                </input>

                <img id="refresh" onClick={() => {fetchFiles()}} src={RefreshIcon} alt="refresh"/>
                <label id="timer"/>

                <table className="table table-sm" id="table">
                    <thead>
                        <tr>
                            <th style={{width: "8%"}}><input id="selectall" type="checkbox" onClick={(event) => {
                                if (event.target.checked) {
                                    $(":checkbox").each(function() {
                                        if ($(this).is(":visible")) {
                                            this.checked = true;
                                        }
                                    });
                                } else {
                                    $(":checkbox").each(function() {
                                        this.checked = false;
                                    });
                                }}}/></th>

                            <th style={{width: "10%"}}></th>
                            <th style={{width: "50%"}}>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginateData.map(pd => (
                            <tr id="columns" key={pd.name}>
                                <td><input value={pd.name} onClick={() => {
                                    $("#selectall").prop("checked", false);
                                }} type="checkbox"/></td>

                                <td id="img"><img
                                    src={`data:image/jpeg;base64,${pd.view}`}
                                    onError={(e) => (e.target.src = DefaultFile)}
                                    id="thumbnails"
                                    alt="thumbnail"/>
                                </td>

                                <td>{pd.name}</td>
                                <td>{pd.type.toUpperCase()} File</td>
                                <td>{formatFileSize(pd.size)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {entries === 0 ? <label id="nodata">No Data to Display</label> : null}

                <div id="loadingBar" className="stripes"/>
                <button className="btn btn-success" onClick={downloadFiles}>Download</button>
                <button className="btn btn-danger" style={{marginLeft: "5px"}} onClick={deleteFiles}>Delete</button>
            </div>

            <div id="authModal" className="modal">
                <div className="modal-content">
                    <div className="login-header">
                        <img src={FileTransferLogo} alt="filetransfer" width="75" height="75"/>
                        <h4>Web File Transfer</h4>
                    </div>

                    <div className="prompt my-4">
                        <div className="card mx-auto" style={{width: "20rem"}}><br/>
                            
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" id="password" className="form-control"/>
                                </div>
                                <div id="authResult" style={{color:"red"}}/><br/>

                                <div className="d-flex flex-row" style={{gap: "8px"}}>
                                    <button onClick={() => {
                                        fetch(`http://${ServerIP}/api/login`, {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({password: document.getElementById("password").value}),
                                        })
                                        .then((response) => { return response.text(); })
                                        .then((response) => {
                                            if (response === "correct") {
                                                $("#password").val(null);
                                                $("#authResult").html(null);
                                                $("#authModal").hide();
                                                fetchFiles();
                                                RefreshTimer();
                                        
                                            } else document.getElementById("authResult").innerHTML = response;
                                        });
                                    
                                    }} className="btn btn-success">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;