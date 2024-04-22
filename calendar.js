import React, { useState } from 'react';
import './Calendar.css';

const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
const WEATHER_API_KEY = "95d5d1d4a7e1e1cad9e1a82cd6416715";

const Calendar = ({ lists }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState([]);


  //pobierz ilość dni w miesiącu
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  //pobierz pierwszy dzień miesiąca
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  //generowanie danie w kalendarzu
  const generateCalendar = () => {
    const totalDaysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const calendar = [];

    // Dni z poprzedniego miesiąca
    for (let i = prevMonthDays - firstDayOfMonth + 2; i <= prevMonthDays; i++) {
      calendar.push({
        day: i,
        month: currentDate.getMonth() - 1,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, i)
      });
    }

    // Dni z tego mieśiąca
    for (let i = 1; i <= totalDaysInMonth; i++) {
      calendar.push({
        day: i,
        month: currentDate.getMonth() + 1,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }

    // Dni z następnego miesiąca
    const totalDaysDisplayed = Math.ceil((calendar.length + firstDayOfMonth) / 7) * 7;
    let nextMonthDay = 1;
    while (calendar.length < totalDaysDisplayed) {
      calendar.push({
        day: nextMonthDay,
        month: currentDate.getMonth() + 2,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDay)
      });
      nextMonthDay++;
    }

    return calendar;
  };

  //zapisywanie zmienej na podstawie wybranego przez użytkownika dnia
  const handleDayClick = (day) => {
    setSelectedDate(day);
  };


  //pobieranie zaplanowanych zadań z wybranego dnia
  const filterElements = (selectedDate) => {
    const filteredElements = lists.map((list) => {
      const dueElements = list.elements.filter((element) => {
        const elementDate = new Date(element.due_date);
        return (
          elementDate.getDate() === selectedDate.date.getDate() &&
          elementDate.getMonth() === selectedDate.date.getMonth() &&
          elementDate.getFullYear() === selectedDate.date.getFullYear()
        );
      });
      return dueElements.length > 0 ? { title: list.title, elements: dueElements } : null;
    }).filter(item => item !== null);
    return filteredElements;
  };

  //tworzenie kalendarza
  const renderCalendar = () => {
    const calendar = generateCalendar();
    return calendar.map((day, index) => {
      let dayClassName = `calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${hasPlannedEvents(day.date) ? 'planned-event' : ''}`;
      return (
        <div
          key={index}
          className={dayClassName}
          onClick={() => handleDayClick(day)}
        >
          {day.date.getDate()}
        </div>
      );
    });
  };


  const hasPlannedEvents = (date) => {
    return lists.some(list => {
      return list.elements.some(element => {
        const elementDate = new Date(element.due_date);
        return (
          elementDate.getDate() === date.getDate() &&
          elementDate.getMonth() === date.getMonth() &&
          elementDate.getFullYear() === date.getFullYear()
        );
      });
    });
  };

  // zamknięcie okna z informacjami czy w wybranym przez użytkownika dniu są zaplanowane zadania
  const closeModal = () => {
    setSelectedDate(null);
    setWeatherInfo([]);
    setCity("");
  };

  const handleCityInputChange = (event) => {
    setCity(event.target.value);
    
  };


  const weatherData = async () =>{
    const txt = document.getElementById("weather-error");
    if(city !== ""){
      try{
        const LatLon = await getLonAndLan();
        console.log("LAT LON:");
        console.log(LatLon[0].lat);
        const weatherData = await getWeatherData(LatLon);
        console.log("WEATHER:");
        console.log(weatherData.list);
        setWeatherInfo(weatherData.list);
      }
      catch(error){
        
        txt.innerHTML = error;
      }
      txt.innerHTML = ""
    }
    else{
      txt.innerHTML = "Wpisz miasto";
    }
  };

  const getLonAndLan = async () =>{
    
    const LonLatURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + WEATHER_API_KEY;
    const LonLatResponse = await fetch(LonLatURL);
    if (!LonLatResponse.ok) {
      throw new Error(`Error fetching location data for '${city}': ${LonLatResponse.statusText}`);
    }

    return await LonLatResponse.json();
  };

  const getWeatherData = async (LatLon) =>{
    const txt = document.getElementById("weather-error");

    try{
      
      
      
      const weatherURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + LatLon[0].lat + '&lon=' + LatLon[0].lon + '&appid=' + WEATHER_API_KEY;
      const weatherResponse = await fetch(weatherURL);
      if (!weatherResponse.ok) {
        throw new Error(`Error fetching location data for '${city}': ${weatherResponse.statusText}`);
      }
      return await weatherResponse.json();
    }
    catch(error)
    {
      txt.innerHTML = error;
    }
  };

  const filterData = (date) =>{
    const infoForSelectedDate = weatherInfo.filter((dayData) => {
      const daysDate = new Date(dayData.dt_txt.slice(0, 10));
      console.log("Date: " + daysDate.getDate());
      return date.date.getDate() === daysDate.getDate() &&  date.date.getMonth() === daysDate.getMonth() && date.date.getFullYear() === daysDate.getFullYear();
    })
   
    return infoForSelectedDate;
  };

  //wyświetlanie czy w wybranym przez użytkownika dniu jest zaplanowane jakieś zadanie
  const Modal = ({ date }) => {
    const filteredElements = filterElements(date); 
    const filteredDayInfo = filterData(date); 
    const day = date.date.getDate();
    const month = date.date.toLocaleString('default', { month: 'long' });;
    const year = date.date.getFullYear();
  
    return (
      <div className="modal-calendar">
        {sessionStorage.getItem("user") !== null ? (
          <div className="modal-content-calendar">
          <span className="close" onClick={closeModal}>&times;</span>
          <p className='date-info'>{day} {month} {year}</p>
          {
          filteredDayInfo.length > 0 ? (    
          <div>
                
            <div className='weather-input'>
              <input className='weather-city-input' type='text' value={city} onChange={handleCityInputChange} placeholder='Enter the city' autoFocus></input>
              <button className='weather-button' onClick={weatherData}>Sprawdź pogodę</button>
              <p id='weather-error'></p>
            </div>
            <div className='weather-cards'>
             {filteredDayInfo.map((dayData, index) => (
                <div className='weather-card' key={index}>
                  <p className='temperature'>
                    {(dayData.main.temp - 273).toFixed(1) + "°C"}
                  </p>
                  <img className='weather-icon' src={'https://openweathermap.org/img/wn/' + dayData.weather[0].icon + '@2x.png'}></img>
                  <p className='weather-hour'>
                    {dayData.dt_txt.slice(11, 16)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          ) : (
            <div className='weather-input'>
              <input className='weather-city-input' type='text' value={city} onChange={handleCityInputChange} placeholder='Enter the city' autoFocus></input>
              <button className='weather-button' onClick={weatherData}>Sprawdź pogodę</button>
              <p id='weather-error'></p>
            </div>
          )
        
          }
          {filteredElements.length > 0 && (
            <div className="modal-list-container">
              
              {filteredElements.map((filteredList, index) => (
                <div key={index} className="list-group">
                  <h3 className='modal-list-title'>{filteredList.title}</h3> 
                   
                    <ul className='modal-element-container'>
                      
                      {filteredList.elements.map((element, elementIndex) => (
                        <li className='modal-list-element' key={elementIndex}>{element.description}</li>
                      ))}
                    </ul>
                  
                  
                </div>
              ))}
            </div>
          )}
          {filteredElements.length === 0 && <p>Brak zadań zaplanowanych na wybrany dzień</p>}
        </div>
        ) : (
          <div className="modal-content-calendar">
          <span className="close" onClick={closeModal}>&times;</span>
          <p>Zaloguj się aby móc przeglądać informacje o wybranym dniu</p>
          </div>
        )
      }
        
      </div>
    );
  };

  //wyświetlanie strony
  return (
    
    <div className="calendar">
      
      {selectedDate && <Modal date={selectedDate} />}
      <div className="calendar-header">
        
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          &lt;
        </button>
        <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          &gt;
        </button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-of-week">
            {day}
          </div>
        ))}
      </div>
      <div className="days-grid">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
