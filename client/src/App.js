import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Dogs from './components/Dogs';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import DogAdd from './components/DogAdd';
import DogDetail from './components/DogDetail';
import DogEdit from './components/DogEdit';
import DogDelete from './components/DogDelete';
import Cats from './components/Cats';
import CatAdd from './components/CatAdd';
import CatDetail from './components/CatDetail';
import CatEdit from './components/CatEdit';
import CatDelete from './components/CatDelete';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  const [dogs, setDogs] = useState();
  const [cats, setCats] = useState();
  const [dog_url, setDogUrl] = useState('/dogs/?limit=3&offset=0');
  const [cat_url, setCatUrl] = useState('/cats/?limit=3&offset=0');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const getDogs = async (url, options=null) => {
      setDogUrl(url);
      console.log("was here");
      console.log(url);
      console.log(options);
      try {
          const response = await axiosPrivate.get(url, options);
          console.log(response.data);
          setDogs(response.data);
      } catch (err) {
          console.error(err);
          navigate('/login', { state: { from: location }, replace: true });
      }
  }
  const getCats = async (url, options=null) => {
    setCatUrl(url);
      try {
          const response = await axiosPrivate.get(url, options);
          console.log(response.data);
          setCats(response.data);
      } catch (err) {
          console.error(err);
          navigate('/login', { state: { from: location }, replace: true });
      }
  }

  const getAll = async (signal) => {
    await getDogs(dog_url, {
      signal: signal
    });
    await getCats(cat_url, {
      signal: signal
    });
  }

  useEffect( () => {
      const controller = new AbortController();
      getAll(controller.signal);
      return () => {
        controller.abort();
      }
  }, []);

  const dogAddHandler = async (dog) => {
      console.log('DOGS: ', dog);
      const response = await axiosPrivate.post('/dogs/', JSON.stringify(dog));
      console.log(response.data);
      getDogs(dog_url);
  }
  const dogUpdateHandler = async (dog) => {
    console.log('DOG: ', dog);
    const response = await axiosPrivate.put('/dogs/', JSON.stringify(dog));
    console.log(response.data);
    getDogs(dog_url);
  }
  const dogDeleteHandler = async (dog) => {
    console.log('DOG: ', dog);
    const x = '/dogs/' + dog['id']
    const response = await axiosPrivate.delete(x);
    console.log(response.data);
    getDogs(dog_url);
  }

  const catAddHandler = async (cat) => {
    console.log('CATS: ', cat);
    const response = await axiosPrivate.post('/cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(cat_url);
  }
  const catUpdateHandler = async (cat) => {
    console.log('CAT: ', cat);
    const response = await axiosPrivate.put('/cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(cat_url);
  }
  const catDeleteHandler = async (cat) => {
    console.log('CAT: ', cat);
    const x = '/cats/' + cat['id']
    const response = await axiosPrivate.delete(x);
    console.log(response.data);
    getCats(cat_url);
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="dogs" element={<Dogs dogs={dogs} getDogs={getDogs} />} />
          <Route path="dogs/create" element={<DogAdd addHandler={dogAddHandler} />} />
          <Route path="dogs/view/:id" element={<DogDetail />} />
          <Route path="dogs/edit/:id" element={<DogEdit updateHandler={dogUpdateHandler} />} />
          <Route path="dogs/:id" element={<DogDelete deleteHandler={dogDeleteHandler} />} />
          <Route path="cats" element={<Cats cats={cats} getCats={getCats} />} />
          <Route path="cats/create" element={<CatAdd addHandler={catAddHandler} />} />
          <Route path="cats/view/:id" element={<CatDetail />} />
          <Route path="cats/edit/:id" element={<CatEdit updateHandler={catUpdateHandler} />} />
          <Route path="cats/:id" element={<CatDelete deleteHandler={catDeleteHandler} />} />
        </Route>


        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;