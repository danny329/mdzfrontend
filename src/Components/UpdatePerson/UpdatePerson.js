import {React, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import './UpdatePerson.css';
import Schema from '../../mdz_pb';
import swal from 'sweetalert';
import {BACKENDSERVER, stompClient, _arrayBufferToBase64, _base64ToArrayBuffer} from '../../App';
function UpdatePerson() {
    let { filename } = useParams();
    let types = filename.substring(filename.lastIndexOf('.')+1, filename.length);

    useEffect(() => {
        console.log(types, filename)
        const headers = {
            'Content-Type': 'application/x-protobuf',
            'fileType': types
        }    
        axios.get(`${BACKENDSERVER}/api/persons/${filename}`, {
            headers: headers
        })
        .then((response) => {
            let bytearrayvalue = _base64ToArrayBuffer(response.data)
            const person  = Schema.Person.deserializeBinary(bytearrayvalue);
            console.log(person)
            let Name = document.querySelector('#Name');
            let Dob = document.querySelector('#Dob');
            let Age = document.querySelector('#Age');
            let Salary = document.querySelector('#Salary');
            let FileType = document.querySelector('#FileType');
            
            Name.value = person.getName();
            Dob.value = person.getDob();
            Age.value = person.getAge();
            Salary.value = person.getSalary();
            FileType.value = types;
        })
        .catch((error) => {
            console.log(error)
        })
        return () => {
            // cleanup
        }
    }, [])
    const updateHandler = e =>{
        e.preventDefault();
        let Name = document.querySelector('#Name');
        let Dob = document.querySelector('#Dob');
        let Age = document.querySelector('#Age');
        let Salary = document.querySelector('#Salary');
        let Message = document.querySelector('#Message');
        
        if(Number(Age.value) != moment().local().diff(moment(Dob.value).local(),"years")){
            Message.innerHTML = 'Age and Dob mismatch.';
        }
        else{
            Message.innerHTML = '';
            // can make probuf with these and snd via socket
            const person = new Schema.Person();
            person.setName(Name.value);
            person.setDob(Dob.value);
            person.setSalary(Salary.value);
            person.setAge(Age.value);
            
            console.log(typeof(person), person)
            let BinarySerializedData = person.serializeBinary();
            let strperson = _arrayBufferToBase64(BinarySerializedData)
            
            console.log(typeof(strperson), strperson, filename)
            stompClient.send(`/app/persons/${filename}`, 
            {
                'fileType': types,
                'Content-Type': 'application/protobuf'
            }, 
            strperson);

        }
    };

    setTimeout(()=>{
        const reciever = stompClient.subscribe('/topic/person', function (data) {
            let bytearrayvalue = _base64ToArrayBuffer(data.body)
            const persons = Schema.ResponsePerson.deserializeBinary(bytearrayvalue);
            swal("Updated successfully!", `${persons.getId()}`, "success");
        });
    },1000)

    const UpdateAge = newAge => {
        let Age = document.querySelector('#Age');
        let updatedage = moment().local().diff(moment(newAge).local(),"years");
        Age.value = updatedage;
    };
    
    return (
        <div>
            <p className="personHeader">Create Person Record</p>
            <form method="POST" className="elementform">
                <div className="inner-sep">
                    <input type="text" placeholder="Enter Name" name="Name" className="Name form-control" id="Name" required/>
                    <input type="date" placeholder="Enter DOB" name="Dob" className="Dob form-control" id="Dob" onChange={e => UpdateAge(e.target.value)} max={moment().local().format('YYYY-MM-DD')} min={moment("1900-01-01").local().format('YYYY-MM-DD')} required/>
                </div>
                <div className="inner-sep">
                    <input type="number" placeholder="Enter Age" name="Age" className="Age form-control" id="Age" min="1" max="121" required/>
                    <input type="number" placeholder="Enter Salary" name="Salary" className="Salary form-control" id="Salary" min="1" required/>
                </div>
                <div>
                    <select className="FileType form-control" id="FileType" required disabled>
                        <option value="0" disabled>Select file type</option>
                        <option value="CSV">CSV</option>
                        <option value="XML">XML</option>
                    </select>
                </div>
                <p name="Message" id="Message"></p>
                <button className="btn btn-info" onClick={updateHandler}>Update</button>
            </form>
        </div>
    )
}

export default UpdatePerson
