import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const Loading = (props) => {
    const { t } = useTranslation()
    const { description } = props
    return (
        <Box data-testid={'loading-component'} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 3,
            minHeight: '33vh'
        }} >

            <CircularProgress sx={{ color: 'primary.mainOrange' }} />

            <Typography variant="pagesubtitle">
                {t(description)}
            </Typography>

        </Box>
    )
}

export default Loading
