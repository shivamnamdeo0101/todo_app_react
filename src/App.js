//This is a App.js File (Changes By Sahil Bansal)
import logo from './logo.svg';
import './App.css';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useState,useEffect} from "react";
import firebase from "./base";
import moment from "moment";

function App() {

  const [todo_list, set_todo_list] = useState([]);

  const [text, set_text] = useState("");

  const [todo, set_todo] = useState({});

  const [loading, setLoading] = useState(true);

  const [search, set_search] = useState("");

  useEffect(() => {

    const subscriber = firebase.firestore()
      .collection('todo')
      .orderBy('timestamp','desc')
      .onSnapshot(querySnapshot => {
        
        const todo_list_ = [];
  
        querySnapshot.forEach(doc => {

          if(doc.data().note.toLowerCase().includes(search.toLowerCase())){
             todo_list_.push({
                ...doc.data(),
                 key: doc.id
            });
          }
           
                  
        
        });
    
        set_todo_list(todo_list_);
        setLoading(false);
      });
  
    
    return () => subscriber();
  }, [search]); 


if(loading){
  return(
    <div>
      <h1>Loading</h1>
    </div>
  )
}


  const add_todo = ()=>{

    if(todo){
      //Agar todo h to update wala code chlega ni to add wala else ka 
          firebase.firestore().collection("todo").doc(todo.key).set({note:text,timestamp:Date.now()},{});
          alert("Todo Updated");
          set_todo({});
          set_text("");
    }else{
          firebase.firestore().collection("todo").add({note:text,timestamp:Date.now()},{})
          alert("Todo Added");
          set_text("");
    }

    
     
  }

  const delete_todo = (key)=>{
    if(window.confirm("Are you sure to delete this todo")){
      firebase.firestore().collection("todo").doc(key).delete();
      alert("Todo Deleted");
    }
    
  }

  const edit_todo = (item)=>{
    set_text(item.note);
    set_todo(item);
  }



  return (
    <div className="App">
      <div className="container">
          <div className="header">
              <h1>Todo App</h1>



              <div> 
                <input type="text" value={text} onChange={(e)=>set_text(e.target.value)}/>


                <IconButton onClick={()=>add_todo()}>
                  <AddIcon />
                </IconButton>
              </div>

          </div>

          <div className="search">
            <input type="text" placeholder="Search here..." value={search} onChange={(e)=>set_search(e.target.value)}/>
          </div>

          <div className="todo_list">
            <h5>Total Results Fetched : {todo_list.length}</h5>
              {
                todo_list.map((item,index)=>(
                   <div className="todo_comp">

                        <div className="head">
                          <h6>{moment(item.timestamp).format("LLLL")}</h6>
                          <h3>{index + 1}.  {item.note}</h3>
                        </div>
                        

                        <div className="todo_comp_buttons">
                          <IconButton onClick={()=>edit_todo(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={()=>delete_todo(item.key)}> 
                            <HighlightOffIcon />
                          </IconButton>
                        </div>
                    </div>
                ))
              
              }
          </div>


      </div>
    </div>
  );
}

export default App;
