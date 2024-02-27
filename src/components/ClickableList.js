import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 420,
    '& .MuiFilledInput-underline:before': {
      borderBottom: 'none', // Removes the border bottom
    },
    '& .MuiFilledInput-underline:after': {
      borderBottom: 'none', // Removes the border bottom after input is focused
    },
    '& .MuiFilledInput-underline:hover:before': {
      borderBottom: 'none', // Removes the border bottom on hover
    }
  },
  grid: {
    display:'flex',
    justifyContent:'center',
    padding: '15px',
    flexDirection: 'column',
    gap:'1rem'
  },
  titleContainer:{
    display:'flex',
    justifyContent:'center',
  },
  title:{
    fontSize: '16px'
  }
}));

export default function SelectedListItem({data,clickFunction}) {
  const classes = useStyles();
  const [itemSelected, setItemSelected] = useState('')

  const handleChange = (event) => {
     setItemSelected(event.target.value);
   };

   useEffect(() => {
     if(data.length > 0){
       const firstItem = data[0]
       setItemSelected(firstItem.string)
     }
   },[data])

  const ListItemsSelect = ({data, clickFunction}) => {
    return (
      <Grid cotnainer className={classes.grid}>
      <Grid container item className={classes.titleContainer}>
        <Typography className={classes.title} variant='h6'>LLISTAT DE CONTRACTES</Typography>
      </Grid>
      <Grid container item>
      <FormControl variant="filled" className={classes.formControl} fullWidth>
          <Select
            labelId="simple-select-filled-label"
            id="simple-select-filled"
            value={itemSelected}
            onChange={handleChange}
          >
            {data.map(element => <MenuItem value={element.string}>{ element.contract } - { element.contract_address }</MenuItem>)}
          </Select>
      </FormControl>
      </Grid>
      <Button onClick={() => clickFunction(itemSelected)}>SELECCIONAR</Button>
      </Grid>
    )
  }



  return (
    <div className={classes.root}>
      <ListItemsSelect data={data} clickFunction={clickFunction}/>
    </div>
  );
}
