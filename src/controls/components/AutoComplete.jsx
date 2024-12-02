import React, { useEffect } from 'react'
import { createRef, useState } from "react"
//import { Icon, Spinner } from '../';
import { Button, ButtonGroup, Dropdown, IconButton, Input, InputGroup, Loader, Popover, Whisper } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import { FaCircleNotch, FaClosedCaptioning, FaCloudRain, FaRegUserCircle, FaSearch, FaSpinner, FaSync, FaSyncAlt, FaTimes, FaTimesCircle } from "react-icons/fa"
import _ from 'lodash'

import './AutoComplete.css'
import { PickerPopup } from 'rsuite/esm/internals/Picker'
//import { IconPlus, IconSearch } from '../icons';

const Result = React.createContext()

const AutoComplete = ({label, text, value = null, onSearch, onChange, children}) => {

    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')
    const [data, setData] = useState([])

    const inputRef = createRef()
    const itemRef = createRef()

    itemRef.current = []

    useEffect(() => {
        document.addEventListener("click", () => onClear())
        document.addEventListener("keydown", (event) => {
            if (event.keyCode == 27) {
                onClear()
            }
            if (event.keyCode == 9) {
                onClear()
            }
        })
    }, [])

    const onInuptChange = async (value) => {

        setSearch(value?.toUpperCase())

        //if (_.isEmpty(value)) {
        //    setData([])
        //    return
        //}

        setLoading(true)

        onSearch(value)
            .then((data) => setData(data))
            .finally(() => setLoading(false))

    }

    const onInputKeyDown = (event) => {
        
        if (event.keyCode == 40) {
            event.preventDefault()
            itemRef?.current[0]?.focus()
        }
        if (event.keyCode == 13) {
            itemRef?.current[0]?.click()
        }
    }

    const onItemKeyDown = (event, index, item) => {

        if (event.keyCode == 40) {
            event.preventDefault();
            itemRef?.current[index + 1]?.focus()
            return
        }
        
        if (event.keyCode == 38) {
            event.preventDefault()
            itemRef?.current[index - 1]?.focus()
            return
        }

        if (event.keyCode == 13) {
            onSelected(item)
        }

        inputRef.current?.focus()

    }

    const onSelected = (item) => {
        onClear()
        onChange(item)
    }

    const onClear = () => {
        setSearch('')
        setData([])
    }
    
    return (
        <>
          

            <div className="textfield-filled right-inner-addon">
                <span className="left"></span>
                <span className="right">
                    {loading ? <FaSyncAlt className='animated rotate' color='#696969' /> : value ? <div style={{cursor: 'pointer'}} onClick={() => onChange(undefined)}>&#x2715;</div> : <FaSearch style={{cursor: 'pointer'}} onClick={() => onInuptChange('')} /> }
                </span>
                <input type="text" className='input-search' ref={inputRef} placeholder={!value ? '' : text(value)} value={search} onFocus={() => {if(!value) onInuptChange('')}} onChange={(event) => onInuptChange(event.target.value)} onKeyDown={onInputKeyDown} />
                <span>{label}</span>
            </div>

            {_.size(data) > 0 && (
                <div className='autocomplete'>
                    <div className="autocomplete-items">
                        {data?.map((item, index) => {
                            return (
                                <div ref={ref => itemRef.current[index] = ref} key={index} tabIndex={-1} onKeyDown={(event) => onItemKeyDown(event, index, item)} onClick={() => onSelected(item)}>
                                    <Result.Provider value={item}>
                                        {children}
                                    </Result.Provider>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

        </>
    )

}

AutoComplete.Result = Result.Consumer

export const ControlAutoComplete = AutoComplete