
import logo from './logo.png';
import './App.css';
 
function App() {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        NFT Marketplace
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mx-auto mt-5">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className= "mt-5">NFT Marketplace Catto</h1>
              <p>
                Edit <code>src/frontend/components/App.js</code> and save to reload.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
