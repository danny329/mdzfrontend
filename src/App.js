import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {useState} from 'react';
import './App.css';
const SOCKET_URL = "http://127.0.0.1:8080/handler";
var stompClient = null;
function App() {
  const [clientConnected, setclientConnected] = useState(false);
  
  var sock = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(sock);
  stompClient.connect({}, function (frame) {
      setclientConnected(true);
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/persons', function (data) {
          console.log(JSON.parse(data.body).content);
      });
  });
  sock.onopen = function() {
      console.log('open');
      // sock.send('test');
  };
 
  sock.onmessage = function(e) {
      console.log('message', e.data);
      // sock.close();
  };
 
  sock.onclose = function() {
      setclientConnected(false);
      console.log('close');
  };
 
  const clickHandler = () =>{
    try {
      stompClient.send("/app/persons", {}, JSON.stringify({id:1,name:'daniel',dob:'27/03/1996',salary:87955.00,age:27}));
      return true;
    } catch(e) {
      return false;
    }
  }
  return (
    <div className="App">
     
      <button onClick={clickHandler}>click</button>
    </div>
  );
}

export default App;
