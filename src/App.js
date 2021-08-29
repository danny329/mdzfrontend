import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './Components/Header/Header';
import Personform from './Components/Personform/Personform';
import FetchScreen from './Components/FetchScreen/FetchScreen';
import UpdatePerson from './Components/UpdatePerson/UpdatePerson';
export const BACKENDSERVER = 'https://mdzbackend.azurewebsites.net';
// export const BACKENDSERVER = 'http://127.0.0.1:8080';
export var stompClient = null;
const SOCKET_URL = `${BACKENDSERVER}/handler`;
export function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}
export function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
function App() {
  
  var sock = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(sock);
  stompClient.connect("daniel","pauls", function (frame) {
      console.log('Connected: ', stompClient);
  }, function(err){
    console.log('err',err)
  });
 
  return (
    <Router>
      <div className="App">
        <Header/>
      </div>
      <Switch>
        <Route path='/' exact component={FetchScreen}></Route>
        <Route path='/persons' exact component={Personform}></Route>
        <Route path='/persons/:filename' component={UpdatePerson}></Route>
      </Switch>
    </Router>
  );
}

export default App;
