import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { motion } from 'framer-motion'
import { delay } from 'framer-motion/dom';

interface Todo {
  text: string;
  completed: boolean;
  id: number;
}

function App() {
  const weeks = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const carousel = useRef()
  const weekOfDay = new Date().getDay();
  const today = weeks[weekOfDay];

  const [toDos, setTodos] = useState<Todo[]>([]);
  const [toDo, setTodo] = useState<Todo>({ text: '', completed: false, id: 0 });
  const [message, setMessage] = useState<string>('');
  const [pic, setPic] = useState<(string | File)[]>([])
  const [width, setWidth] = useState<Number>(0)

  const validate = () => {
    const s1 = toDo.text.toLowerCase();
    const s2 = toDo.text.toUpperCase();
    if (toDos.some((item) => item.text === s1 || item.text === s2)) {
      setMessage('Already exists');
    } else {
      const letters = /^[A-Za-z\s]+$/;
      if (toDo.text.match(letters)) {
        setTodos([...toDos, { ...toDo, id: Date.now() }]);
        setMessage('');
        setTodo({ text: '', completed: false, id: 0 });
      } else {
        setMessage('Please input a valid input');
        setTimeout(() => {
          setMessage('')
        }, 4000);
      }
    }
  };

  // useLayoutEffect(() => {
  //   const calculateWidth = () => {
  //     if (carousel.current) {
  //       let a = carousel.current.scrollWidth - carousel.current.offsetWidth;
  //       setWidth(a);
  //     }
  //   };
  //   const delay = setTimeout(calculateWidth, 100);
  //   return () => clearTimeout(delay);
  // }, [carousel]);

  return (
    <div className='bg-gray-800  pt-10' style={{ minHeight: '200vh' }}>
      <div className='text-center'>
        <motion.h1 className='text-4xl font-bold mb-4' whileHover={{ scale: 2.1 }} transition={{ delay: 1 }} animate={{ x: 0, scale: 2 }} initial={{ x: 500, scale: 0 }} style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,152,0,1) 0%, rgba(45,39,209,1) 95%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>ToDo List</motion.h1>

        <motion.p className='text-lg text-white' animate={{ x: 0, scale: 1 }} transition={{ delay: 1.5, type: 'spring', duration: 0.8 }} initial={{ x: -2000, scale: 0 }}>Whoop, it's {today} 🌝 ☕ </motion.p>
      </div>
      <div className='flex justify-center mt-6'>
        <div className='w-1/2'>
          <input
            value={toDo.text}
            type='text'
            onChange={(e) => setTodo({ ...toDo, text: e.target.value })}
            placeholder='🖊️ Add item...'
            className='rounded p-2 border border-gray-300 w-3/4'
          />
          <button
            onClick={validate}
            //  style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,152,0,0.8) 0%, rgba(45,39,209,0.5) 85%)'}}
            className='bg-blue-800 text-white px-4 py-2 rounded ml-2'
          >
            Add
          </button>
        </div>
      </div>
      <div className='flex justify-center mt-6'>
        <div className='w-1/2'>
          {toDos.map((value) => (
            <motion.div key={value.id} className='flex items-center justify-between bg-gray-200 p-4 my-2 rounded text-white font-bold'
              style={{ backgroundImage: 'linear-gradient(90deg, rgba(45,39,209,1) 0%, rgba(255,152,0,1) 85%)' }} whileHover={{ scale: 1.1 }}
            >
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  onChange={() => {
                    setTodos((prev) =>
                      prev.map((todo) =>
                        todo.id === value.id ? { ...todo, completed: !todo.completed } : todo
                      )
                    );
                  }}
                  checked={value.completed}
                  className='mr-2'
                />
                <p className={value.completed ? 'line-through' : ''}>{value.text}</p>
              </div>
              <button
                onClick={() => {
                  setTodos((prev) => prev.filter((todo) => todo.id !== value.id));
                }}
                className='text-red-500'
              >
                <MdOutlineDeleteOutline className='text-black' />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <div className='flex justify-center mt-4'>
        <div className='w-1/2'>
          <motion.h3 className='text-red-500 font-bold' animate={{ x: message ? [-500, 500, 0] : -300 }} initial={{ x: -2000 }}>{message}</motion.h3>
          <div className='mt-4'>
            <h3 className='text-lg font-bold text-white'>Completed tasks</h3>
            {toDos
              .filter((value) => value.completed)
              .map((value, index) => (
                <motion.ul key={value.id} animate={{ y: [-5, 0, 5, 0, -5] }} transition={{ repeat: Infinity, duration: 2 }} >
                  <li className='flex text-gray-300' >
                    ({index + 1})<h4 className='  text-lg ml-2' >{value.text}</h4>
                  </li>
                </motion.ul>
              ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-4  bg-slate-950 py-4'>
        <div className='flex justify-center'>
          <h2 className='text-2xl font-bold text-white'>Images of Today</h2>
        </div>
        <motion.div className='flex justify-center carousel x-auto  ' >
          <div className='grid grid-cols-5 gap-3 justify-center'>
            {pic?.map((image, index) => (
              <motion.div key={index} className='mx-3 flex justify-center' whileHover={{ scale: 2 }}>
                <img src={URL.createObjectURL(image)} alt={`Image ${index}`} className="mt-2 rounded-lg" style={{ pointerEvents: 'none', maxWidth: '200px', maxHeight: '200px' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>


        <label className="custom-file-upload cursor-pointer mt-4" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', backgroundColor: 'linear-gradient(90deg, rgba(45, 39, 209, 1) 0%, rgba(255, 152, 0, 1) 85%)', color: 'white', cursor: 'pointer' }}>
  <input type="file" style={{ display: 'none' }} multiple onChange={(e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setPic([...pic, ...selectedFiles]);
      e.target.value = '';
    }
  }} />
  Add Images
</label>


      </div>

    </div>
  );
}

export default App;
