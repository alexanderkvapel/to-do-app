import React,{useState, useEffect} from 'react';
import {AiOutlineDelete, AiOutlineEdit, AiOutlinePlus} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';

import './App.css';

import { motion } from 'framer-motion'

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [uncompletedTasks, setUncompletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [title, setTitle] = useState("");
  const [titlePlaceholder, setTitlePlaceholder] = useState("Title");
  const [newTitlePlaceholder, setNewTitlePlaceholder] = useState("New Title");
  const [description, setDescription] = useState("");
  const [titleStyleError, setTitleStyleError] = useState({});
  const [newTitleStyleError, setNewTitleStyleError] = useState({});

  const handleAddTask = () => {
    if (!title) {
      setTitlePlaceholder("Title can't be empty!");
      setTitleStyleError({ background: `rgb(226, 190, 190)` })

      console.log(`[ERROR] ${new Date()} Title of creating task is empty.`);
    } else {
      setTitlePlaceholder("Title")
      setTitleStyleError({ background: `rgb(226, 226, 226)`})

      if (!description) {
        console.log(`[WARNING] ${new Date()} Description of created task is empty`)
      }

      let newTask = {
        title: title,
        description: description
      };
  
      let updatedUncompletedTasks = [...uncompletedTasks];
      updatedUncompletedTasks.push(newTask);
      setUncompletedTasks(updatedUncompletedTasks);
      localStorage.setItem('uncompletedTasks', JSON.stringify(updatedUncompletedTasks));
  
      setTitle("");
      setDescription("");
      setIsCompleteScreen(false);

      console.log(`[INFO] ${new Date()} task "${title}" added succesfully.`);
    }
  };

  const handleDeleteTask = (index) => {
    let tasks = [...uncompletedTasks];
    tasks.splice(index, 1);

    localStorage.setItem('uncompletedTasks', JSON.stringify(tasks));
    setUncompletedTasks(tasks);

    console.log(`[INFO] ${new Date()} task deleted from uncompleted task succesfully.`);
  };

  const handleDeleteCompletedTask = (index) => {
    let tasks = [...completedTasks];
    tasks.splice(index,1);

    localStorage.setItem('completedTasks', JSON.stringify(tasks));
    setCompletedTasks(tasks);

    console.log(`[INFO] ${new Date()} task deleted from completed tasks succesfully.`);
  };

  const handleCompleteTask = (index) => {
    let currentTime = new Date();
    let DD = currentTime.getDate();
    let MM = currentTime.getMonth() + 1;
    let YY = currentTime.getFullYear();
    let hh = currentTime.getHours();
    let mm = currentTime.getMinutes();
    let ss = currentTime.getMinutes();
    let completedOn = `${DD}/${MM}/${YY} at ${hh}:${mm}:${ss}`;

    let filteredItem = {
      ...uncompletedTasks[index],
      completedOn: completedOn
    };

    let updatedCompletedTasks = [...completedTasks];
    updatedCompletedTasks.push(filteredItem);
    setCompletedTasks(updatedCompletedTasks);

    handleDeleteTask(index);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks))

    console.log(`[INFO] ${new Date()} task completed succesfully.`);
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);

    console.log(`[INFO] ${new Date()} task "${item.title}" is editing.`);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return {...prev,title:value}
    })
  };
  
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return {...prev,description:value}
    })
  };

  const handleUpdateTask = () => {
    if (!currentEditedItem.title) {
      setNewTitlePlaceholder("Title can't be empty!")
      setNewTitleStyleError({ background: `rgb(226, 190, 190)` })

      console.log(`[ERROR] ${new Date()} Title of editing task is empty.`);
    } else {
      setNewTitlePlaceholder("Title")
      setNewTitleStyleError({ background: `rgb(204, 204, 204)` })

      if (!currentEditedItem.description) {
        console.log(`[WARNING] ${new Date()} Description of editing task is empty`)
      }

      let updatedTask = [...uncompletedTasks];

      updatedTask[currentEdit] = currentEditedItem;
      setUncompletedTasks(updatedTask);

      setCurrentEdit("");

      console.log(`[INFO] ${new Date()} task "${currentEditedItem.title}" is edited succesfully.`);
    }
  }

  const showTasksVariants = {
    visible: i => ({
      opacity: 1,
      width: 'auto',
      transition: {
        delay: i * 0.1,
        duration: .5
      }
    }),
    hidden: {
      width: '0px',
      opacity: 0,
    }
  }

  const showTaskEditVatiants = {
    visible: {
      opacity: 1,
      height: 'auto'
    },
    hidden: {
      opacity: 0,
      height: '98px'
    }
  }

  useEffect(()=>{
    let savedUncompletedTasks = JSON.parse(localStorage.getItem('uncompletedTasks'));
    let savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'))

    if (savedUncompletedTasks) {
      setUncompletedTasks(savedUncompletedTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }
  },[]);

  return (
    <div className="container">
      <div className="header-wrapper">
        <h1>TO DO APP</h1>
      </div>

      <div className="main-wrapper">
        <div className="input-wrapper">
          <div className="input-container">
            <motion.div 
              className="input-item"
              whileHover={{
                scale: 1.4
              }}
            >
              <AiOutlinePlus
                className="primary-btn"
                onClick={handleAddTask}
                title="Add"
              />
            </motion.div>

            <div className="input-fields-wrapper">
              <div className="input-item">
                <input 
                  type="text" 
                  name="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder={titlePlaceholder} 
                  style={titleStyleError}
                />
              </div>
              <div className="input-item" onSubmit={handleAddTask}>
                <textarea 
                  type="text" 
                  name="description"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Description" 
                />
              </div>
            </div>

            <div className="empty-wrapper"></div>
          </div>
        </div>

        <div className="list-wrapper">
          <div className="screen-switcher-wrapper">
            <button 
              className={`switch-screen-btn ${!isCompleteScreen && 'switch-screen-active-btn'}`} 
              onClick={() => setIsCompleteScreen(false)}
            >
                UNCOMPLETED TASKS
            </button>
            <button 
              className={`switch-screen-btn ${isCompleteScreen && 'switch-screen-active-btn'}`} 
              onClick={() => setIsCompleteScreen(true)}
            >
                COMPLETED TASKS
            </button>
          </div>
          
          <div className="task-list-wrapper">
            {(!isCompleteScreen && uncompletedTasks.length === 0) && 
              <div className="task-list-item-wrapper">
                <h3>No added tasks yet.</h3>
              </div>
            }
            {(isCompleteScreen && completedTasks.length === 0) && 
              <div className="task-list-item-wrapper">
                <h3>No completed tasks yet.</h3>
              </div>
            }

            {!isCompleteScreen && uncompletedTasks.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <motion.div
                    className="edit-wrapper" 
                    key={index}
                    variants={showTaskEditVatiants}
                    initial='hidden'
                    animate='visible'
                  >
                    <input 
                      type="text"
                      name="newTitle"
                      placeholder={newTitlePlaceholder} 
                      onChange={(e) => handleUpdateTitle(e.target.value)} 
                      value={currentEditedItem.title}
                      style={newTitleStyleError}
                    />
                    <textarea 
                      name="newDescription"
                      placeholder="Description"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)} 
                      value={currentEditedItem.description}
                    />
                    <button
                      className="complete-edit-btn"
                      type="button"
                      onClick={handleUpdateTask}
                      title="Complete edit"
                    >
                      COMPLETE
                    </button>
                  </motion.div>
                )
              } else {
                return (
                  <motion.div 
                    className="task-list-item-wrapper" 
                    variants={showTasksVariants}
                    initial='hidden'
                    animate='visible'
                    custom={index}
                  >
                    <motion.div 
                      className="complete-btn-wrapper"
                      whileHover={{
                        scale: 1.4
                      }}
                    >
                      <BsCheckLg 
                        className="primary-btn" 
                        onClick={() => handleCompleteTask(index)}
                        title="Complete"
                      />
                    </motion.div>

                    <div className="info-wrapper">
                        <h3>{item.title}</h3>
                        <h2>{item.description}</h2>
                    </div>
        
                    <div className="control-btn-wrapper">
                      <AiOutlineEdit
                        className="primary-btn"
                        onClick={() => handleEdit(index, item)}
                        title="Edit"
                      />
                      <AiOutlineDelete 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(index)}
                        title="Delete"
                      />
                    </div>
                  </motion.div>
                )
                }
            })}

            {isCompleteScreen && completedTasks.map((item, index) => {
              return(
                <motion.div 
                  className="task-list-item-wrapper"
                  key={index}
                  variants={showTasksVariants}
                  initial='hidden'
                  animate='visible'
                  custom={index}
                > 
                  <div className="info-wrapper">
                    <div className="info">
                      <h3>{item.title}</h3>
                      <h2>{item.description}</h2>
                      <p><small>Completed on: {item.completedOn}</small></p>
                    </div>
                  </div>

                  <div className="control-btn-wrapper">
                    <AiOutlineDelete 
                      className="delete-btn" 
                      onClick={() => handleDeleteCompletedTask(index)}
                      title="Delete"
                    />
                  </div>
                </motion.div>
              )
            })}

          </div>
        </div>
      </div>

      <div className="footer-wrapper">
        <p>M8O-105M-23 Kvapel Alexander</p>
      </div>
    </div>
  );
};

export default App;
