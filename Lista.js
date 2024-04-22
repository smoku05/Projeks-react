import React, { useState, useEffect } from 'react';
import './list.css';

const Lista = ({ id, title, elements, user }) => {
  const [Items, setItems] = useState([]);
  const [InputText, setInputText] = useState('');
  const [DueDate, setDueDate] = useState('');
  const [SelectedItem, setSelectedItem] = useState([]);
  const [SelectedUsun, setSelectedUsun] = useState([]);
  const [filter, setFilter] = useState('All');



  //ustawiane tekstu
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  //ustawianie filtrów 
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };


  //  filtrowanie wyborów 
  const getFilteredItems = () => {
    switch (filter) {
      case 'All':
        return Items;
      case 'Done':
        return Items.filter((item) => item.isDone);
      case 'Not Done':
        return Items.filter((item) => !item.isDone);
      default:
        return Items;
    }
  };


  // zmiana koloru tekstu na podstawie ile dni do deadline 
  const getColorBasedOnDueDate = (item) => {
    const today = new Date();
    const dueDate = new Date(item.due_date);
    const diffInDays = Math.ceil(Math.abs(dueDate - today) / (1000 * 60 * 60 * 24));

    if (item.isDone) {
      return 'green';
    } else if (dueDate.getTime() < today.getTime()) {
      return 'red';
    } else if (diffInDays <= 3) {
      return 'orange';
    } else if (diffInDays <= 7) {

      return 'yellow';
    } else {

      return 'black';
      
    }
  };

  //zapisywanie lokalnie listy planów
  const savetoLocalStorage = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith("Lista"));

    const lista = {
      id: id,
      title: title,
      user: user,
      elements: Items,
    };

    for (let i = 0; i < keys.length; i++) {
      const indexOfList = i + 1;
      const element = localStorage.getItem(`Lista ${indexOfList}`);
      const listObj = JSON.parse(element);

      if (listObj.title === title) {
        localStorage.setItem(`Lista ${indexOfList}`, JSON.stringify(lista));
        return;
      }
    }
  };

  //przetwarzanie usunięcia wybranego zadania po potwierdzeniu przez użytkownika 
  const usun = () => {
    const item = SelectedUsun
    const filteredItems = Items.filter((existingItem) => existingItem !== item);
    setItems(filteredItems);
    setSelectedUsun([]);
  }

  useEffect(() => {
    setItems(elements);
  }, []);

  useEffect(() => {
    savetoLocalStorage();
  }, [Items]);

  const addListItem = () => {
    if (InputText === '') {
      return;
    }

    //dodawanie nowego zadania do listy
    const newItem = {
      description: InputText,
      due_date: DueDate,
      isDone: false
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setInputText('');
  };

  //przenoszenie informacji które zadanie wybrano do zmiany terminu
  const handleElementClick = (item) => {
    setSelectedItem(item);
  };

  //ustwanaie terminu
  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  //zmienienie terminu dla zadania po potwierdzeniu przez użytkonika chęci do zmiany terminu na wybrany
  const setItemDueDate = () => {
    const updatedItems = Items.map((item) =>
      item === SelectedItem ? { ...item, due_date: DueDate } : item
    );
    setItems(updatedItems);
    setDueDate('');
    setSelectedItem([]);
  };

  //zmiana znacznika czy ukończono zadanie czy nie 
  const handleIsDone = (item) => {
    const updatedItems = Items.map((element) =>
      element === item ? { ...element, isDone: !element.isDone } : element
    );
    setItems(updatedItems);
  };

  //zamknięcie prompta o zmiane terminu
  const closeModal = () => {
    setSelectedItem([]);
    setDueDate('');
  };

  //zamknięcie zapytania o usunięcie zadania
  const closeUsuniecie = () => {
    setSelectedUsun([]);
  };



  //przenoszenie informacji które zadanie wybrano do usunięcie
  const handleRemoveItem = (item) => {
    setSelectedUsun(item);
  };


  // ustawianie terminu danego zadania
  const Modal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <p className='termin-text'>Termin</p>
          <input
            type="date"
            value={DueDate}
            onChange={handleDueDateChange}
            className='date-input'
          />
          <button className='date-set-button' onClick={setItemDueDate}>Ustaw termin</button>
        </div>
      </div>
    );
  };

  //wyświetlanie zapytania czy chcesz usunąć zadanie 
  const Usuniecie = () => {
    const zadanie = SelectedUsun.description; 
    return (
      
      <div className="modal">
        <div className="modal-content">
          <p className='termin-text'>Czy chesz usunąć zadanie {zadanie} ?</p>
          <button className='date-set-button' onClick={usun}>Tak</button>
          <button className='date-set-button' onClick={closeUsuniecie}>Nie</button>
        </div>
      </div>
    );
  };

  // wygląd strony
  return (
    <div className="main-container">
      <div className="title-bar">
        <h1 className='title'>
          {title}
        </h1>
      </div>

      <div className="list-container">
        <div className='add-item-container'>
          <input type="text" value={InputText} onChange={handleInputChange} placeholder="Wprowadź tekst" className='list-desc-input'/>
          <button className='add-item-button' onClick={addListItem}>➕</button>
          <p className='filter-text'>
            Filtr
          </p>
          <select className='filter-select' value={filter} onChange={handleFilterChange}>
            <option value="All">Wszystkie</option>
            <option value="Done">Zrobione</option>
            <option value="Not Done">Nie zrobione</option>
          </select>
        </div>

        <ol className="list">
          {getFilteredItems().map((item, index) => (
            <li className='list-element' key={index}>
              <span style={{ color: item.isDone ? 'green' : getColorBasedOnDueDate(item)}} className='list-element-desc'>
                {item.description}
              </span>
              <span style={{ color: item.isDone ? 'green' : getColorBasedOnDueDate(item)}} className='date-txt'>
                {item.due_date ? item.due_date : ''}
              </span>
              <button className='done-button' onClick={() => handleIsDone(item)}>Ukończone {item.isDone ? "✅" : "❌"}</button>
              <button className='remove-button' onClick={() => handleRemoveItem(item)}>Usuń 🗑️</button>
              <button className='date-button' onClick={() => handleElementClick(item)}>Ustaw termin</button>
            </li>
          ))}
        </ol>
        {SelectedItem.length !== 0 && <Modal></Modal>}
        {SelectedUsun.length !== 0 && <Usuniecie></Usuniecie>}
      </div>
    </div>
  );
};

export default Lista;
