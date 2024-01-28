import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './app/routes';
import CatalogProvider from './app/context/catalog-context';
import MessageProvider from './app/context/message-context';


function App() {
  return (
    <div className="App" id="page">
      <MessageProvider>
        <CatalogProvider>
          <BrowserRouter>
            <MyRoutes />
          </BrowserRouter>
        </CatalogProvider>
      </MessageProvider>
    </div>
  );
}

export default App;
