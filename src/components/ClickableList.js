import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px',
    flexDirection: 'column',
    gap: '1rem'
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '16px'
  },
  groupButton: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

export default function SelectedListItem({ data, title, acceptFunction, acceptButtonText, cancelFunction, cancelButtonText }) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const { t } = useTranslation()

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };


  const ListItemsSelect = ({ data }) => {

    return (
      <Grid container className={classes.grid}>
        <Grid container item className={classes.titleContainer}>
          <Typography className={classes.title} variant='h6'>{title}</Typography>
        </Grid>
        <Grid container item>
          <List className={classes.root}>
            {data.map((value) => {
              return (
                <ListItem key={value.id} role={undefined} dense button onClick={() => handleToggle(value.id)}>
                  <ListItemIcon>
                    <Checkbox
                      data-testid={"checkbox-" + value.id}
                      edge="start"
                      checked={checked.indexOf(value.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={value.id} primary={value.primary} secondary={value.secondary} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid>
          <Typography variant='body2' dangerouslySetInnerHTML={{
            __html: t('GENERATION_ADD_ASSIGNMENTS_INFO_MSG')
          }} />
        </Grid>
        <Grid item container className={classes.groupButton}>
          {acceptFunction ? <Button color='primary' data-testid={"list-accept-button"} disabled={checked.length === 0} onClick={() => acceptFunction(checked)}>{acceptButtonText}</Button> : null}
          {cancelFunction ? <Button color='primary' data-testid={"list-cancel-button"} onClick={cancelFunction}>{cancelButtonText}</Button> : null}
        </Grid>
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      <ListItemsSelect data={data} />
    </div>
  );
}
