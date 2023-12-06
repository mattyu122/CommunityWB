import { ChangeEvent, useState } from 'react';
import './App.css';
import HandBill from './DataModel/Handbill';
import Whiteboard from './component/Whiteboard';

function App() {
  const [handBill, setHandBill] = useState<HandBill|null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if(!file) {
      return;
    }
    setHandBill(new HandBill(file));
  }
  const uploadFiles = () => {
    if (!handBill) {
      return;
    }

    const formData = handBill.toFormData();
    fetch('http://localhost:3000/whiteboard/addHandBill', {
      method: 'POST',
      body: formData
    })
    .then(response => 
      {
        if (response.ok) {
          console.log(response);
          return response
        }
        throw new Error('Network response was not ok.');
      })
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Community White Board</h1>
        <input type="file" onChange={handleFileChange}/>
        <button onClick={uploadFiles}>Upload</button>
      </nav>
      <main className="main">
        <Whiteboard/>
      </main>
    </div>
  );
}

export default App;
