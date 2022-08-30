import React from 'react'
import {Alert, AlertTitle} from '@material-ui/lab'
import { Box,Typography } from '@material-ui/core'


const AlertBox = ({ severity, title, description, children }) => {
    
    return (
        <Box mt={0.75} mb={1.5}>
            <Alert severity={severity}>
                <AlertTitle>{title}</AlertTitle>
                {description && <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                />}
                {children}
            </Alert>
        </Box>
    )
}
export default AlertBox