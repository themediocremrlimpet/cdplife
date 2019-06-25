import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
export default ({value, onChange, submit}) => (
  <div>
    <h5>Lock Eth</h5>
    <TextField value={value} onChange={onChange} />
    <Button color="primary" onClick={submit}>Lock {value} Eth</Button>
  </div>
)