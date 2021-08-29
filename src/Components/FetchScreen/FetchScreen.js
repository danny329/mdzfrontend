import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Schema from '../../mdz_pb';
import {BACKENDSERVER, stompClient, _arrayBufferToBase64, _base64ToArrayBuffer} from '../../App';
import './FetchScreen.css';
function FetchScreen() {
    const [types, setTypes] = useState('CSV');
    const [fileNames, setfileNames] = useState(null);
    
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/x-protobuf',
            'fileType': types
        }    
        axios.get(`${BACKENDSERVER}/api/persons`, {
            headers: headers
        })
        .then((response) => {
            let bytearrayvalue = _base64ToArrayBuffer(response.data)
            const listofFile  = Schema.ListOfFiles.deserializeBinary(bytearrayvalue);
            console.log(listofFile.getFilenameList());
            setfileNames(listofFile.getFilenameList());
        })
        .catch((error) => {
            console.log(error)
        })
        return () => {
            // cleanup
        }
    }, [types])
    return (
        <div className="fetchscreenwrapper">
            <div className="selection">
                <p className="fstitle">List of Files</p>
                <select className="FileType form-control mx-auto w-50" id="FileType" onChange={e=>setTypes(e.target.value)}>
                    <option value="0" disabled>Select file type</option>
                    <option value="CSV">CSV</option>
                    <option value="XML">XML</option>
                </select>
            </div>
            {   fileNames?
                (fileNames.map(e =>
                    <div className="itemwrapper" key={e}>
                        <p className="itemp">FileName:</p>
                        <p className="itemp">{e}</p>
                        <Link className="linka" to={`/persons/${e}`}>Edit</Link>
                    </div>
                )):'No item to display.'
            }
        </div>
    )
}

export default FetchScreen
