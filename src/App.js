import logo from './logo.svg';
import './App.css';
import {useEffect, useMemo, useReducer, useState} from 'react'
import data from "./data.js";


function App() {
  let [searchItem, setSearchItem] = useState("");
  let [items, setItems] = useState(data)
  let [item, setItem] = useState({name: "Name", mobileNumber: "Number", id: ""})

 useEffect(() => {
  // set intialy data to localstorage 

  if (localStorage.getItem("data") === null) {
    localStorage.setItem("data", JSON.stringify(data))
    setItems(JSON.parse(localStorage.getItem("data")))
    }
  // filter items by search 
  let filterItems = JSON.parse(localStorage.getItem("data")).filter((item) => 
      item.name.toLocaleLowerCase().includes(searchItem.toLowerCase()) ||
      item.mobileNumber.toLocaleLowerCase().includes(searchItem) 
  )
  setItems(filterItems) // set filteritems
 },[searchItem])

  let addContact = (e) => {
    e.preventDefault();

    // lets check if number exits 
    let number = e.target.number.value;
    let name = e.target.name.value;

    // validate number lenght
    if (number.length !== 10) {
      alert("Number Leangth Required 10")
      return;
    } 
    //  if number exits show error message [number already exits try onther number]
    let isNumberExits = JSON.parse(localStorage.getItem('data')).find((item) => item.mobileNumber === number)
    if (isNumberExits) {
      alert("Number Already Exits")
      return;
    }
    // if number not exits save to local storage
    let data = JSON.parse(localStorage.getItem("data"));
    let newData = [...data,{name: name, mobileNumber: number}]

    localStorage.setItem("data", JSON.stringify(newData))
    setItems(newData)
    alert("Contact Created")
  }

  let deleteItem = (i, item) => {
    let number = item.mobileNumber;
    // confirm before delete item
    if ( !window.confirm(` Name: ${item.name}\n Number: ${item.mobileNumber}\n ` + "Delete Contact")) return;

    let newData = JSON.parse(localStorage.getItem('data')).filter((item) => 
    item.mobileNumber !== number
    )
    setItems(newData);
    localStorage.setItem("data", JSON.stringify(newData))
  }

  let handleEdit = (item) => {
    item.id = item.mobileNumber;
    setItem(item)
  }
  let handleEditChange = (e) => {
   
    if (e.target.name === "name") setItem({name: e.target.value, mobileNumber: item.mobileNumber,id:item.id});
    if (e.target.name === "number") setItem({mobileNumber: e.target.value,name: item.name, id: item.id})
  
  }
  let handleEditSubmit = (e) => {
    e.preventDefault()
   
    // validate number lenght
    let number = item.mobileNumber; 
     if (number.length !== 10) {
      alert("Number Leangth Required 10")
      return;
    } 

    // get all data 
    let data = JSON.parse(localStorage.getItem("data"));
    // confirm before update
    if ( !window.confirm("Update Confirmation")) return;

    let newData = data.map((itm, index) => {
      if ( itm.mobileNumber === item.id ) {
         delete item.id;
         return item;
      } else {
        return itm
      }
    })

    localStorage.setItem('data', JSON.stringify(newData));
    setItems(newData)
    setItem({name: "Name", mobileNumber: "Number"})
    
  }

  return (
    <div className='container-xxl row mt-4'>
      <div id="sidebar" className='col-6 order-2'>
      <form onSubmit={addContact} className="px-3 py-3 border border-2 rounded-4">
      <h4>Add New Contact</h4>
      <label for="name">Contact Name</label>
      <input type="text" name='name' placeholder='Type Name' className='form-control' />
      <label for="name" className='mt-2'>Contact Number</label>
      <input type="Number" name='number' placeholder='Type Number' className="form-control"/>
      <button type='submit' className='btn btn-primary mt-2'>Add Contact</button>
      </form>
      <br/>
      <form onSubmit={handleEditSubmit} className="px-3 py-3 border border-2 rounded-4">
        <h4>Update Contact Information</h4>
        <label for="name">Change Name</label>
        <input type="text" name='name' value={item.name} onChange={handleEditChange} className="form-control" />
        <label for="number" className='mt-2'>Change Number</label>
        <input type="text" name='number' value={item.mobileNumber} onChange={handleEditChange} className="form-control"/>
        <button type='submit' className='btn btn-primary mt-2'>Update Contact</button>
      </form>
      <br/>
      </div>

      <div id='main' className='col-6 order-1'>
      <h4>Contact List</h4>
      <input type="text" placeholder="Search.. by name or contact number" onChange={(e) => setSearchItem(e.target.value)} className="form-control"/>
      <ul className="m-0 p-0">
        {items.map((item,index,array) => 
        <li key={index} className="border border-2 p-2 mt-4 rounded">
          <div className="fs-6 mt-3"><span className='text-muted fs-6'>Contact Name : </span>{item.name}</div>
          <div className='fs-6 mb-3'><span className='text-muted'>Contact Number : </span> {item.mobileNumber}</div>
          <button onClick={() => deleteItem(index, item)} className="btn btn-danger btn-sm opacity-75">Delete</button>
          <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm opacity-75 ms-2">Edit</button>
        </li>
         )}
      </ul>
      </div>

    </div>
  );
}




export default App;
