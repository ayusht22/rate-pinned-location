import { useState ,useEffect} from 'react';
import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import {Room,Star} from '@material-ui/icons'
import axios from 'axios'
import {format} from 'timeago.js'
import Register from './components/Register';
import Login from './components/Login';
import './app.css'
function App() {
  const myStorage=window.localStorage;
  const [currentUsername,setCurrentUserName]=useState(myStorage.getItem("user"));
  const [newPlace,setNewPlace]=useState(null);
  const [pins,setPins]=useState([]);
  const[currentPlaceId,setCurrentPlaceId]=useState('');
  const [title,setTitle] =useState('');
  const [star,setStar]=useState(0);
  const [desc,setDesc]=useState('');
  const [newRating,setNewRating]=useState(0);
  const [showButton,setShowButton]=useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100wh",
    height: "100vh",
    latitude: 21,
    longitude: 79,
    zoom: 4
  });

  useEffect(()=> {
    const getPins=async ()=> {
    try{
      const allPins=await axios.get("/pins")
      setPins(allPins.data);
    }
    catch(err){
    console.log(err);
    }
  };
  getPins();
  },[]) 
  const handleMarkerClick=(id,lat,long)=>{
   setCurrentPlaceId(id);
   setViewport({...viewport,longitude:long,latitude:lat})
  }

  const handleAddClick=(e)=>{
   if(currentUsername){const [long,lat]=e.lngLat;
   setNewPlace({
     latitude:lat,
     longitude:long
   })}
  }
  
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const newPin={
      username:currentUsername,
      title,
      description:desc,
      rating: star,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
      averageRating:star,
      users:[currentUsername]

    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }
  
  const handleLogout=()=>{
    myStorage.removeItem("user");
    setCurrentUserName(null);
  }

  const handleNewReview=async(pin)=>{
    if(pin.users.includes(currentUsername)){
      alert("you have already submitted a review");
      return;
    }
    const newAverage=(pin.averageRating*pin.users.length+Number(newRating))/(pin.users.length+1);
    pin.averageRating=newAverage;
    pin.users.push(currentUsername);
    await axios.put("/pins",{
      pin
    })
  }
  const handleOptionClick=()=>{
    setShowButton(true);
  }

  return (
    <div className="App">
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onDblClick={handleAddClick}
      transitionDuration="150"
    >
    
    {pins.map(p=>(
      <> 
       <Marker 
       latitude={p.latitude} 
       longitude={p.longitude} 
       offsetLeft={-20} 
       offsetTop={-10}>
         <Room style={{
           fontSize: 7 * viewport.zoom,
           color: currentUsername === p.username ? "tomato" : "slateblue",
           cursor: "pointer",}}
          onClick={() => handleMarkerClick(p._id,p.latitude,p.longitude)}
         />
         
       </Marker>
       {p._id===currentPlaceId &&(
       <Popup
             latitude={p.latitude}
             longitude={p.longitude}
             closeButton={true}
             closeOnClick={false}
             onClose={false}
             anchor="left" 
             onClose={()=>setCurrentPlaceId(null)}
       >
             <div className="card">
               <label>Place</label>
               <h4>{p.title}</h4>
               <label>Review</label>
               <p className="desc">{p.description}</p>
               <label>Rating</label>
               <div className="stars">
               {Array(Math.floor(p.averageRating)).fill(<Star className="star" />)}
               </div>
               <p className="desc">Average Rating : {p.averageRating}</p>
               <span className="username">Created by <b>{p.username}</b></span>
               <span className="date">{format(p.createdAt)}</span>
               {currentUsername&& (<> <label>Rate the place ?</label>
                <select onChange={(e) => setNewRating(e.target.value)} onClick={handleOptionClick}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select></>)}
                {currentUsername&& showButton&&<button onClick={()=>handleNewReview(p)}>submit review</button>}
             </div>
        </Popup>)
      }
      </>
    ))}
    {newPlace&&(
      <>
       <Marker
       latitude={newPlace.latitude}
       longitude={newPlace.longitude}
       offsetLeft={-3.5 * viewport.zoom}
       offsetTop={-7 * viewport.zoom}
     >
       <Room
         style={{
           fontSize: 7 * viewport.zoom,
           color: "tomato",
           cursor: "pointer",
         }}
       />
     </Marker>
     <Popup
             latitude={newPlace.latitude}
             longitude={newPlace.longitude}
             closeButton={true}
             closeOnClick={false}
             onClose={false}
             anchor="left" 
             onClose={()=>setNewPlace(null)}
       >  <div>
       <form onSubmit={handleSubmit}>
         <label>Title</label>
         <input
           placeholder="Enter a title"
           
           onChange={(e) => setTitle(e.target.value)}
         />
         <label>Description</label>
         <textarea
           placeholder="Say us something about this place."
           onChange={(e) => setDesc(e.target.value)}
         />
         <label>Rating</label>
         <select onChange={(e) => setStar(e.target.value)}>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           <option value="4">4</option>
           <option value="5">5</option>-
         </select>
         <button type="submit" className="submitButton">
           Add Pin
         </button>
       </form>
     </div>
     </Popup>
     </>
    )}
    {currentUsername?(<button className="button logout" onClick={handleLogout}>logout</button>):
    (<div className="buttons">
    <button className="button login" onClick={e=>setShowLogin(true)}>login</button>
    <button className="button register" onClick={e=>{setShowRegister(true)}}>register</button>
  </div>)
    }
    {showRegister&&<Register setShowRegister={setShowRegister}/>}
    {showLogin&&<Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUserName={setCurrentUserName}/>}
    
    </ReactMapGL>
    </div>
  );

}

export default App;
