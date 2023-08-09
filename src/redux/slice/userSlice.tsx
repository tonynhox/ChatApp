import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
    name:'users',
    initialState: {
        user:''
    },
    reducers:{
        username : (state,action )=>{
            state.user= action.payload
        }
    }
})