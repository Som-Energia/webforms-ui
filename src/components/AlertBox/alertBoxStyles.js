
export const alertBoxStyles = {
    backgroundColor: 'background.alertBox',
    color: 'primary.mainOrange',
    '& .MuiAlertTitle-root': {
        color: 'primary.mainOrange'
    },
    '& .MuiTypography-root': {
        color: 'primary.mainOrange',
        fontSize: 'body.md.regular'
    },
    '& a': theme => ({
        color: `${theme.palette.primary.mainOrange} !important`
    }),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    '& .MuiAlert-icon': {
        display: 'flex',
        alignItems: 'flex-start',
        mt: '0.35em'
    }
}