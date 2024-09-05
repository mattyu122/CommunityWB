import { ChangeEvent, useState } from 'react';
import './App.css';
import HandBill from './DataModel/HandBill/Handbill';
import WhiteBoard from './DataModel/WhiteBoard';
import UploadBillModal from './component/UploadBillModal';
import WhiteboardComponent from './component/Whiteboard';
function App() {
  const [handBill, setHandBill] = useState<HandBill|null>(null);
  const [height, setHeight] = useState<number>(300);
  const [width, setWidth] = useState<number>(150);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if(!file) {
      return;
    }
    setHandBill(new HandBill(file,height,width));
  }

  //fetch a specific whiteboard
  const whiteboard = new WhiteBoard("Bayview");
  const uploadFiles = () => {
    if (!handBill) {
      return;
    }
    console.log(handBill)
    handBill.height = height;
    handBill.width = width;
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

  const handleHeightChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setHeight(parseInt(event.target.value));
  }
  const handleWidthChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setWidth(parseInt(event.target.value));
  }
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Community White Board @ {whiteboard.location}</h1>
        <input type="file" onChange={handleFileChange}/>
        <div>
          <label htmlFor="title">Height</label>
          <textarea id="height" placeholder="Enter height here..." onChange={handleHeightChange}></textarea>
        </div>
        <div>
          <label htmlFor="title">Width</label>
          <textarea id="width" placeholder="Enter width here..." onChange={handleWidthChange}></textarea>
        </div>
        <button onClick={()=>setIsModalOpen(true)}>Upload</button>
        <UploadBillModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen((prev) => !prev)} 
        onSubmit={uploadFiles} 
        />
      </nav>
      <main className="main">
        <WhiteboardComponent whiteBoard={whiteboard}/>
      </main>
    </div>
  );
}

export default App;
