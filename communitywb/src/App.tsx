import { useCallback, useState } from 'react';
import './App.css';
import WhiteBoard from './DataModel/WhiteBoard';
import UploadBillModal from './component/UploadBillModalStages/UploadBillModal';
import WhiteboardComponent from './component/Whiteboard';
function App() {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //fetch a specific whiteboard
  const whiteboard = new WhiteBoard("Bayview");
  
  const onClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Look Around</h1>
        <button onClick={()=>setIsModalOpen(true)}>Upload</button>
        <UploadBillModal 
        isOpen={isModalOpen} 
        onClose={onClose} 
        />
      </nav>
      <main className="main">
        <WhiteboardComponent whiteBoard={whiteboard}/>
      </main>
    </div>
  );
}

export default App;
