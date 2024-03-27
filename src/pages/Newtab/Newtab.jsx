import './Newtab.css';
import './Newtab.scss';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import secrets from '../../../secrets.development.js';


const Newtab = () => {

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = secrets;

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log(supabase);

  // console.log(supabase);

  const [url, setUrl] = useState('');

  //Store the URL from chrome.storage using useEffect
  useEffect(() => {

    // Grab the questions from the database, ignore if id is 1,5
    const fetchQuestions = async () => {

      let { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .not('id', 'in', [1, 5]);


      console.log(questions);

      if (error) console.log('error', error);

    }

    fetchQuestions();




    chrome.storage.local.get('url', (data) => {
      // Remove https:// from the URL and remove .com and everything after .com
      const urlObject = new URL(data.url);

      // Get the hostname from the URL object
      let hostname = urlObject.hostname;

      hostname = hostname.replace('www.', '').replace('.com', '');

      // Set the state
      setUrl(hostname);
    });
  }, []);

  const handleClick = () => {
    // Get the stored URL from chrome.storage
    chrome.storage.local.get('url', (data) => {

      console.log(data.url);
      // Redirect the from the current active tab to the stored URL
      chrome.tabs.update({ url: data.url });
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Quiz yourself before you continue to {url}
        </p>
        <h6>
          Change subjects you want to learn about in setting pages.
        </h6>
        <button onClick={handleClick}>Enter</button>
      </header>
    </div>
  );
};

export default Newtab;