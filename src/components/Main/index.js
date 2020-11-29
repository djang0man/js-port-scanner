// libs
import React, { useState } from 'react';

import isIP from 'validator/lib/isIP';
import matches from 'validator/lib/matches';

// material ui
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  topSpacing: {
    marginTop: '1em',
  },
  label: {
    fontSize: '.75em !important',
    color: 'rgba(0, 0, 0, 0.54)',
  }
}));

const Main = props => {
  const classes = useStyles();

  const [ip, setIP] = useState('');
  const handleChangeIP = e => {
    const value = e.target.value;
    setIP(value);
  };

  const [ports, setPorts] = useState('');
  const handleChangePorts = e => {
    const value = e.target.value;
    setPorts(value);
  };

  const [scanWellKnown, setScanWellKnown] = useState(false);
  const handleScanWellKnown = (enabled=false) => {
    setScanWellKnown(enabled);
  };

  const [scanType, setScanType] = useState('tcp');
  const handleSetScanType = e => {
    setScanType(e.target.value);
  };

  const [scanRegistered, setScanRegistered] = useState(false);
  const handleScanRegistered = (enabled=false) => {
    setScanRegistered(enabled);
  };

  const [scanEphemeral, setScanEphemeral] = useState(false);
  const handleScanEphemeral = (enabled=false) => {
    setScanEphemeral(enabled);
  };

  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const handleAwaitingResponse = () => {
    setAwaitingResponse(true);
    setReceivedResponse(false);
  };

  const [receivedResponse, setReceivedResponse] = useState(false);
  const handleReceivedResponse = () => {
    setReceivedResponse(true);
    setAwaitingResponse(false);
  };

  const [activePorts, setActivePorts] = useState(null);
  const handleActivePorts = (ports) => {
    setActivePorts(ports);
    handleReceivedResponse();
  };

  const handleSubmit = () => {
    const url = `http://${API_URL}:${API_PORT}/scanner`;
    const method = 'POST';
    const body = JSON.stringify({ ip, ports, scanType, scanWellKnown, scanRegistered, scanEphemeral });
    const headers = { 'content-type': 'application/json', };

    const params = {
      headers,
      body,
      method,
    }

    handleAwaitingResponse();

    fetch(url, params)
      .then(data => data.json())
      .then(res => {
        handleActivePorts(res);
      })
      .catch(error => console.error(error));
  };

  const handleReset = () => {
    // setPorts('');
    // setAddress('');
    // setScanWellKnown(false);
    setReceivedResponse(false);
    setAwaitingResponse(false);
  }

  const btnDisabled = 
    !isIP(ip) ||
    ((!matches(ports, /^[0-9]{1,5}( *,\s* *[0-9]{1,5})*$/) ||
    ports.split(',').slice(-1)[0] > 65535) && (!scanWellKnown && !scanRegistered && !scanEphemeral));

  return (
    <Box m={2}>
      {!awaitingResponse && !receivedResponse && (
        <>
          <Typography variant='h1'>Scan the Ports 🕵️</Typography>
          <form>
            <TextField
              fullWidth
              value={ip}
              margin="normal"
              variant="outlined"
              placeholder="127.0.0.1"
              label="IP Address"
              helperText="Enter the target IP address."
              onChange={e => handleChangeIP(e)}
              InputProps={{
                inputProps: {
                  required: true,
                }
              }}
            />
            <TextField
              value={ports}
              margin="normal"
              variant="outlined"
              label="Specified Ports"
              placeholder="21,80,443"
              helperText="Enter comma-separated valid port numbers."
              onChange={e => handleChangePorts(e)}
              InputProps={{
                inputProps: {
                  required: true,
                }
              }}
            />
            <Box>
              <FormControl component="fieldset">
                <FormGroup>
                  <RadioGroup value={scanType} onChange={handleSetScanType}>
                    <FormControlLabel value="tcp" control={<Radio />} label="TCP" />
                    <FormControlLabel value="udp" control={<Radio />} label="UDP" />
                  </RadioGroup>
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={scanWellKnown}
                        onChange={() => handleScanWellKnown(!scanWellKnown)}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    labelPlacement="end"
                    label="Scan well-known ports (0-1023)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={scanRegistered}
                        onChange={() => handleScanRegistered(!scanRegistered)}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    labelPlacement="end"
                    label="Scan registered ports (1024-49151)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={scanEphemeral}
                        onChange={() => handleScanEphemeral(!scanEphemeral)}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    labelPlacement="end"
                    label="Scan ephemeral ports (49152-65535)"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            <Box className={classes.topSpacing}>
              <Button
                color="primary"
                variant="contained"
                disabled={btnDisabled}
                onClick={handleSubmit}>
                  Submit
                </Button>
            </Box>
          </form>
        </>
      )}
      {awaitingResponse && !receivedResponse && (
        <LinearProgress />
      )}
      {!awaitingResponse && receivedResponse && (
        <>
          <Box>
            {activePorts.length > 0 ? (
              <>
                <Typography variant='h2'>Open Ports 🔓</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Port</TableCell>
                      <TableCell>Status Text</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {activePorts.map(activePort => {
                    return (
                      <TableRow key={activePort.port}>
                        <TableCell>{activePort.port}</TableCell>
                        <TableCell>{activePort.responseText}</TableCell>
                      </TableRow>
                    )
                  })}
                  </TableBody>
                </Table>
              </>
            ) : <Typography variant='h2'>No Open Ports 🔐</Typography>}
          </Box>
          <Box className={classes.topSpacing}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleReset}>
                Scan Again
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Main;
