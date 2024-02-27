import './App.css';
import Stripe from './Components/Stripe';
import {Routes,Route} from "react-router-dom"
import Success from './Components/Success';
import Cancel from './Components/Cancel';
import NavBar from './Components/NavBar';
function App() {
  return (
   <>
    <Routes>
      <Route  path='/' element={<NavBar />}/>
      <Route  path='/success' element={< Success/>}/>
      <Route  path='/cancel' element={< Cancel/>}/>
     </Routes>
   <Stripe/>
   </>
  );
}

export default App;
