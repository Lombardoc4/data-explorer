import React, { useCallback, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { PLANTS } from './DataGenerator'

type Plant = {
  commonName: string,
  scientificName: string,
  bloom:{
      color: string,
      time: string,
  },
  height: number,
  width: number,
  description: string,
  image: string, 
}

interface FreeObject {
  [key: string]: any
}


function TableRow({data} : {data: FreeObject}) {
  
  const NestObject = (item: FreeObject) => {
    return Object.entries(item).map(([key, value])=> {
      if (value && typeof value === 'object') {
        return NestObject(value)
      }
      return (
        <React.Fragment key={value}><span><b>{key}</b>: {typeof value === 'string' ? value : ''}</span><br/></React.Fragment>
      )
    })
  }
  
  return (
    <tr>
      {Object.values(data).map((item, i) => {
        if (!item) {
          return <td key={'blank' + i}>-</td>
        }
        
        if (typeof item === 'object'){
          return (
            <td key={'object' + i}>
              {NestObject(item)}
            </td>
          )
        }
        
        return <td key={item}>{item}</td>
      })}
    </tr>
  );
}

function ItemTable({data, searchVal} : {data: FreeObject[], searchVal: string}) {
  const rows: JSX.Element[] = [];
  
  
  const confirmMatch = (base: string, val: string|number) => {
    return new RegExp(base.toLowerCase(), 'gi').exec(val.toString().toLowerCase())?.length || false;
  }
  
  const pushData = (item: FreeObject) => {
    console.log('item', item);
    // Validate
    // ! Fix for nested objects
    if (
      searchVal.length > 0 && //Confrim Search Value
      Object.values(item).filter(val => {
        if (!val) {
          return false;
        }
        if (typeof val === 'number' || typeof val === 'string') {
          return confirmMatch(searchVal, val) // value is a string or number
        }
        if (typeof val === 'object') {
          return pushData(val);
          // return false;
        } 
        
        return false;
      }).length <= 0
    ) {
      return false;
    }
    
    return true;
  }

  
  data.forEach((item: FreeObject, i: number) => {
    if (pushData(item)) {
      rows.push(
        <TableRow
          key={i}
          data={item} />
      );
      
    }
  });

  const NoDataRow = () => (
    <tr>
      <td style={{padding: '2rem'}} colSpan={data[0] ? Object.keys(data[0]).length : 1}>
        No Data
      </td>
    </tr>
  )
  
  return (
    <div className='read-the-docs'>
      
      <table>
        {rows.length > 0 ? <>
          <thead>
            <tr>
            { data[0] && Object.keys(data[0]).map(k => (
              <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </>
        :
        <tbody><NoDataRow/></tbody>
      }
      </table>
    </div>
  );
}

function SearchBar({searchVal, onSetSearchVal, children} : {children: JSX.Element, searchVal: string, onSetSearchVal: (searchVal: string) => void}) {
  const searchInput = useRef<HTMLInputElement|null>(null);
  
  return(
    <div className="card">
      <h1>API Explorer</h1>
      <div style={{paddingBottom: '0.5rem'}}>{'\u00A0'}</div>
      <form autoComplete="off" className='search-form'>
        <svg 
          onClick={() => searchInput.current && searchInput.current.focus()}
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="search-icon bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        <svg 
          onClick={() => onSetSearchVal('')}
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000" className="close-icon bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <input 
          ref={searchInput}
          type="text" 
          value={searchVal} 
          placeholder="Search..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSetSearchVal(e.currentTarget.value)} />
      </form>
      {children}
    </div>
  )
}

function FilterableTable({data, setData} : {setData: (data: FreeObject[]) => void, data: FreeObject[]}) {
  const [searchVal, setSearchVal] = useState('');
  
  return (
    <>
      <SearchBar 
        searchVal={searchVal}
        onSetSearchVal={setSearchVal}>
        <button className='red' onClick={() => setData([])}>Reset Data</button>
      </SearchBar>
        
      
      <ItemTable 
        data={data}
        searchVal={searchVal} />
    </>
  );
}


function removeLocalStorageItem(url: string) {
  if (!localStorage.pastUrls) {
    return;
  }
  
  const storedUrls = JSON.parse(localStorage.pastUrls);
  
  if (storedUrls.length === 1) {
    delete localStorage.pastUrls;
    return;
  }
  
  // See if url exists
  if (storedUrls) {
    storedUrls.splice(storedUrls.indexOf(url), 1);
    localStorage.pastUrls =JSON.stringify(storedUrls);
  }
}

function saveLocalStorage(url: string) {
  if (!localStorage.pastUrls) {
    // Store to localstorage
    localStorage.pastUrls = JSON.stringify([url]);
    return;
  }
  
  const storedUrls = JSON.parse(localStorage.pastUrls);
  
  if (storedUrls && storedUrls.includes(url))
    return
  
  // See if url exists
  if (storedUrls) {
    storedUrls.push(url);
    localStorage.pastUrls = JSON.stringify(storedUrls);
    
  }
}

function DataSelector({setData} : {setData: (data: FreeObject[]) => void}) {
const [, updateState] = useState({});
const [fetchError, updateErrors] = useState('');
const forceUpdate = useCallback(() => updateState({}), []);
const formRef = useRef<HTMLFormElement|null>(null)

  
  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }
  
  const fetchData = async(url: string) => {
    
    
    try {
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error('Bad Response', {
          cause: {
            res,
          }
        })
      }
      
      const data  = await res.json();
      
      
      // Set Data
      setData(Array.isArray(data) ? data : [data])
      
      // Save Input to localstorage
      saveLocalStorage(url);
      
      // Clear errors
      updateErrors('')
      
      
    } catch (err: any) { //!Fix type
      if (err.cause) {
        
        switch(err.cause.res?.status) {
            case 400: break;
            case 401: break;
            case 404: break;
            case 500: break;
          }
          // handle(err)
      }
      
      if (typeof err.json === "function") {
        err.json().then(jsonError => {
            console.log("Json error from API");
            console.log(jsonError);
        }).catch(genericError => {
            console.log("Generic error from API");
            console.log(err.statusText);
        });
      }
        
        
        // console.log("Fetch error");
        console.log(err);
        // 
        updateErrors('Data could not be accessed')
      
      // throw err
    }
  }
  
  
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const {dataUrl} = Object.fromEntries(formData.entries());

    // Error Handling
    if (dataUrl && typeof dataUrl === 'string'){
      let url = new RegExp("\https?:\/\/(.*?)$").exec(dataUrl);
      
      
      if (url && typeof url === 'object' && url.length > 0 && isValidUrl(dataUrl)){
        fetchData(dataUrl);
        
      }
    }
  }
  
  
  return(
    <>
        <div className="card">
          <h1>API Explorer</h1>
          <form ref={formRef} autoComplete="off" onSubmit={handleSubmit} className='data-url-form'>
            <div style={{paddingBottom: '0.5rem', color: '#ff0000'}}>{fetchError.length > 0 ? fetchError: "\u00A0"}</div>
            <div className='data-url-input'>
                
              <svg 
                onClick={() => formRef.current && formRef.current.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))}
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="enter-icon bi bi-arrow-right" viewBox="0 0 16 16">
                <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
              <input 
                name='dataUrl'
                type="text" 
                placeholder="https://insert-data-url/data.json"/>
            </div>
          </form>
            <button 
            onClick={() => setData(PLANTS)}
            >Example Dataset</button>
            </div>
            
          {localStorage.pastUrls && 
            <>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h2>History</h2>
                <button className='red' onClick={() => {forceUpdate(); delete localStorage.pastUrls}}>Clear</button>
              </div>
              {JSON.parse(localStorage.pastUrls).reverse().map((url :string) => (
                <div key={url} style={{display: 'flex' , justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    {url.length > 47 ? url.substring(0, 47) + '...' : url} {' '}
                    <svg   onClick={() => {removeLocalStorageItem(url); forceUpdate()}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                  </div>
                  <div>
                    
                    <button onClick={() => fetchData(url)}>Explore</button>
                  </div>
                </div>
              ))}
            </>
          }
        </>
  )
}

function App() {
  const [data, setData] = useState<FreeObject[]>([]);

  return (
    <div className="App">
      {data.length <= 0 
        ? <DataSelector setData={setData}/>
        : <FilterableTable data={data} setData={setData}/>
      }
    </div>
  )
}

export default App
