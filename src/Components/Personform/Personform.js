import {React, useState, useEffect} from 'react';
import moment from 'moment';
import './Personform.css';
import Schema from '../../mdz_pb';
import swal from 'sweetalert';
import {BACKENDSERVER, stompClient, _arrayBufferToBase64, _base64ToArrayBuffer} from '../../App';
function Personform() {
   
    const SubmitHandler = e =>{
        e.preventDefault();
        let Name = document.querySelector('#Name');
        let Dob = document.querySelector('#Dob');
        let Age = document.querySelector('#Age');
        let Salary = document.querySelector('#Salary');
        let Message = document.querySelector('#Message');
        let FileType = document.querySelector('#FileType');
        console.log(FileType)
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
            
            let BinarySerializedData = person.serializeBinary();
            let strperson = _arrayBufferToBase64(BinarySerializedData)
            
            console.log(typeof(strperson), strperson)
            
            stompClient.send("/app/persons", 
            {
                'fileType': FileType.value,
                'Content-Type': 'application/x-protobuf'
            }, 
            strperson);

        }
    };

    setTimeout(()=>{
        const reciever = stompClient.subscribe('/topic/persons', function (data) {
            let bytearrayvalue = _base64ToArrayBuffer(data.body)
            const persons = Schema.ResponsePerson.deserializeBinary(bytearrayvalue);
            swal("Added successfully!", `${persons.getId()}`, "success");

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
                    <select className="FileType form-control" id="FileType" required>
                        <option value="0" disabled>Select file type</option>
                        <option value="CSV">CSV</option>
                        <option value="XML">XML</option>
                    </select>
                </div>
                <p name="Message" id="Message"></p>
                <button className="btn btn-primary form-control" onClick={SubmitHandler}>Submit</button>
            </form>
        </div>
    )
}

export default Personform
