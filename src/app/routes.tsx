import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/home'));
const Calalog = lazy(() => import('@/pages/catalog'));

function MyRoutes(){
    
    return (<Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Calalog />} />
        </Routes>
    </Suspense>)
}

export default MyRoutes;