import React, { useEffect, useState } from 'react';
import './App.css';
import Puzzle from './components/Puzzle';

function App() {

      return (
            <div className="App">
                  <Puzzle grid={{ rows: 3, cols: 3 }}></Puzzle>
            </div>
      );
}

export default App;
